import React, { useState, useEffect, useCallback } from 'react';
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  TrashIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  FolderIcon,
  Squares2X2Icon,
  BookOpenIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  adminCourseApi,
  type LevelItem,
  type AdminTopicResponse,
  type AdminPartResponse,
  type AdminSessionResponse,
  type AdminTopicRequest,
  type AdminPartRequest,
  type AdminSessionRequest,
  type DeleteResult,
  type SessionType,
} from '../api/adminCourseApi';
import { StatusBadge } from './StatusBadge';
import { SessionActionButtons } from './SessionActionButtons';
import { SessionFormModal } from './SessionFormModal';
import { PreviewModal } from './PreviewModal';
import { TopicFormModal } from './TopicFormModal';
import { PartFormModal } from './PartFormModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface NotificationState {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export const AdminLessons: React.FC = () => {
  // === STATE QUẢN LÝ DỮ LIỆU ===
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);

  const [topics, setTopics] = useState<AdminTopicResponse[]>([]);
  const [partsMap, setPartsMap] = useState<Record<number, AdminPartResponse[]>>({});
  const [sessionsMap, setSessionsMap] = useState<Record<number, AdminSessionResponse[]>>({});

  // Cây mở rộng/thu gọn
  const [expandedTopicIds, setExpandedTopicIds] = useState<Set<number>>(new Set());
  const [expandedPartIds, setExpandedPartIds] = useState<Set<number>>(new Set());

  // Trạng thái Loading
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingParts, setLoadingParts] = useState<Record<number, boolean>>({});
  const [loadingSessions, setLoadingSessions] = useState<Record<number, boolean>>({});
  const [actionLoading, setActionLoading] = useState(false);

  // Bộ lọc
  type FilterMode = 'all' | 'draft-topics' | 'draft-sessions';
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Thông báo Notification
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotify = (type: NotificationState['type'], message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  };

  // === STATE QUẢN LÝ MODALS ===
  // 1. Topic Modal
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<AdminTopicResponse | null>(null);

  // 2. Part Modal
  const [partModalOpen, setPartModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<AdminPartResponse | null>(null);
  const [targetTopicIdForPart, setTargetTopicIdForPart] = useState<number | null>(null);

  // 3. Session Modal
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AdminSessionResponse | null>(null);
  const [targetPartIdForSession, setTargetPartIdForSession] = useState<number | null>(null);

  // 4. Preview Modal
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewSession, setPreviewSession] = useState<AdminSessionResponse | null>(null);

  // 5. Confirm Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
    itemType: 'Topic' | 'Part' | 'Session';
    parentTopicId?: number;
    parentPartId?: number;
    result?: DeleteResult;
  } | null>(null);

  // ==========================================
  // FETCH DỮ LIỆU
  // ==========================================

  // 1. Tải danh sách Levels
  const loadLevels = async () => {
    setLoadingLevels(true);
    try {
      const data = await adminCourseApi.getLevels();
      setLevels(data);
      if (data.length > 0 && selectedLevelId === null) {
        setSelectedLevelId(data[0].id);
      }
    } catch (err: any) {
      console.error('Lỗi khi tải danh sách levels:', err);
      showNotify('error', 'Không thể tải danh sách trình độ');
    } finally {
      setLoadingLevels(false);
    }
  };

  useEffect(() => {
    loadLevels();
  }, []);

  // 2. Tải danh sách Topics theo Level đang chọn
  const loadTopics = useCallback(async (levelId: number) => {
    setLoadingTopics(true);
    try {
      const data = await adminCourseApi.getTopicsByLevel(levelId);
      setTopics(data);
    } catch (err: any) {
      console.error('Lỗi khi tải topics:', err);
      showNotify('error', 'Không thể tải danh sách chủ đề');
    } finally {
      setLoadingTopics(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLevelId !== null) {
      loadTopics(selectedLevelId);
      setExpandedTopicIds(new Set());
      setExpandedPartIds(new Set());
      setFilterMode('all');
      setSearchQuery('');
    }
  }, [selectedLevelId, loadTopics]);

  // 3. Tải danh sách Parts của một Topic
  const loadParts = async (topicId: number) => {
    setLoadingParts((prev) => ({ ...prev, [topicId]: true }));
    try {
      const data = await adminCourseApi.getPartsByTopic(topicId);
      setPartsMap((prev) => ({ ...prev, [topicId]: data }));
    } catch (err: any) {
      console.error('Lỗi khi tải parts:', err);
      showNotify('error', 'Không thể tải danh sách phần học');
    } finally {
      setLoadingParts((prev) => ({ ...prev, [topicId]: false }));
    }
  };

  // 4. Tải danh sách Sessions của một Part
  const loadSessions = async (partId: number) => {
    setLoadingSessions((prev) => ({ ...prev, [partId]: true }));
    try {
      const data = await adminCourseApi.getSessionsByPart(partId);
      setSessionsMap((prev) => ({ ...prev, [partId]: data }));
    } catch (err: any) {
      console.error('Lỗi khi tải sessions:', err);
      showNotify('error', 'Không thể tải danh sách bài học');
    } finally {
      setLoadingSessions((prev) => ({ ...prev, [partId]: false }));
    }
  };

  // Mở/Đóng Topic
  const toggleTopicExpand = (topicId: number) => {
    const next = new Set(expandedTopicIds);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
      if (!partsMap[topicId]) {
        loadParts(topicId);
      }
    }
    setExpandedTopicIds(next);
  };

  // Mở/Đóng Part
  const togglePartExpand = (partId: number) => {
    const next = new Set(expandedPartIds);
    if (next.has(partId)) {
      next.delete(partId);
    } else {
      next.add(partId);
      if (!sessionsMap[partId]) {
        loadSessions(partId);
      }
    }
    setExpandedPartIds(next);
  };

  // ==========================================
  // BỘ LỌC: Tải hết data khi bật chế độ lọc nháp
  // ==========================================

  const loadAllPartsAndSessions = async () => {
    setLoadingFilter(true);
    try {
      // Tải tất cả parts cho mọi topic
      const partPromises = topics.map(async (t) => {
        if (!partsMap[t.id]) {
          const data = await adminCourseApi.getPartsByTopic(t.id);
          return { topicId: t.id, parts: data };
        }
        return { topicId: t.id, parts: partsMap[t.id] };
      });
      const partResults = await Promise.all(partPromises);
      const newPartsMap = { ...partsMap };
      partResults.forEach((r) => { newPartsMap[r.topicId] = r.parts; });
      setPartsMap(newPartsMap);

      // Tải tất cả sessions cho mọi part
      const allParts = partResults.flatMap((r) => r.parts);
      const sessionPromises = allParts.map(async (p) => {
        if (!sessionsMap[p.id]) {
          const data = await adminCourseApi.getSessionsByPart(p.id);
          return { partId: p.id, sessions: data };
        }
        return { partId: p.id, sessions: sessionsMap[p.id] };
      });
      const sessionResults = await Promise.all(sessionPromises);
      const newSessionsMap = { ...sessionsMap };
      sessionResults.forEach((r) => { newSessionsMap[r.partId] = r.sessions; });
      setSessionsMap(newSessionsMap);
    } catch (err: any) {
      console.error('Lỗi khi tải dữ liệu cho bộ lọc:', err);
      showNotify('error', 'Không thể tải đủ dữ liệu cho bộ lọc');
    } finally {
      setLoadingFilter(false);
    }
  };

  const handleFilterChange = async (mode: FilterMode) => {
    setFilterMode(mode);
    if (mode === 'draft-topics' || mode === 'draft-sessions') {
      await loadAllPartsAndSessions();
    }
  };

  // Kiểm tra topic có chứa nháp nào không (topic nháp, hoặc part nháp, hoặc session nháp/HAS_DRAFT)
  const topicHasDraft = (topic: AdminTopicResponse): boolean => {
    if (topic.badge === 'DRAFT') return true;
    const parts = partsMap[topic.id] || [];
    for (const p of parts) {
      if (p.badge === 'DRAFT') return true;
      const sessions = sessionsMap[p.id] || [];
      if (sessions.some((s) => s.badge === 'DRAFT' || s.badge === 'HAS_DRAFT')) return true;
    }
    return false;
  };

  // Lọc topics theo bộ lọc đang chọn + search
  const filteredTopics = (() => {
    let result = filterMode === 'draft-topics'
      ? topics.filter((t) => topicHasDraft(t))
      : topics;
    if (searchQuery.trim() && filterMode !== 'draft-sessions') {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }
    return result;
  })();

  // Danh sách phẳng các session nháp (cho chế độ lọc draft-sessions)
  const allDraftSessions: Array<{
    session: AdminSessionResponse;
    topicTitle: string;
    topicId: number;
    partTitle: string;
    partId: number;
  }> = [];

  if (filterMode === 'draft-sessions') {
    const q = searchQuery.trim().toLowerCase();
    for (const topic of topics) {
      const parts = partsMap[topic.id] || [];
      for (const part of parts) {
        const sessions = sessionsMap[part.id] || [];
        for (const session of sessions) {
          if (session.badge === 'DRAFT' || session.badge === 'HAS_DRAFT') {
            if (!q || session.title.toLowerCase().includes(q)) {
              allDraftSessions.push({
                session,
                topicTitle: topic.title,
                topicId: topic.id,
                partTitle: part.title,
                partId: part.id,
              });
            }
          }
        }
      }
    }
  }

  // ==========================================
  // XỬ LÝ NGHIỆP VỤ TOPIC
  // ==========================================

  const handleOpenCreateTopic = () => {
    setEditingTopic(null);
    setTopicModalOpen(true);
  };

  const handleOpenEditTopic = (t: AdminTopicResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTopic(t);
    setTopicModalOpen(true);
  };

  const handleSaveTopic = async (data: AdminTopicRequest) => {
    if (editingTopic) {
      await adminCourseApi.updateTopicMetadata(editingTopic.id, data);
      showNotify('success', `Đã cập nhật chủ đề "${data.title}"`);
    } else {
      await adminCourseApi.createTopic(data);
      showNotify('success', `Đã tạo mới chủ đề "${data.title}" (Bản nháp)`);
    }
    if (selectedLevelId) loadTopics(selectedLevelId);
  };

  const handlePublishTopic = async (topic: AdminTopicResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(true);
    try {
      const result = await adminCourseApi.publishTopic(topic.id);
      if (result.valid) {
        showNotify('success', `Đã phát hành chủ đề "${topic.title}" thành công!`);
        if (selectedLevelId) loadTopics(selectedLevelId);
      } else {
        showNotify('warning', result.message || 'Không thể phát hành chủ đề');
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Lỗi khi phát hành chủ đề');
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ NGHIỆP VỤ PART
  // ==========================================

  const handleOpenCreatePart = (topicId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetTopicIdForPart(topicId);
    setEditingPart(null);
    setPartModalOpen(true);
  };

  const handleOpenEditPart = (p: AdminPartResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPart(p);
    setTargetTopicIdForPart(p.topicId);
    setPartModalOpen(true);
  };

  const handleSavePart = async (data: AdminPartRequest) => {
    if (editingPart) {
      await adminCourseApi.updatePartMetadata(editingPart.id, data);
      showNotify('success', `Đã cập nhật phần học "${data.title}"`);
      loadParts(editingPart.topicId);
    } else if (targetTopicIdForPart) {
      await adminCourseApi.createPart(targetTopicIdForPart, data);
      showNotify('success', `Đã tạo mới phần học "${data.title}" (Bản nháp)`);
      loadParts(targetTopicIdForPart);
      if (selectedLevelId) loadTopics(selectedLevelId);
    }
  };

  const handlePublishPart = async (part: AdminPartResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setActionLoading(true);
    try {
      const result = await adminCourseApi.publishPart(part.id);
      if (result.valid) {
        showNotify('success', `Đã phát hành phần học "${part.title}" thành công!`);
        loadParts(part.topicId);
        if (selectedLevelId) loadTopics(selectedLevelId);
      } else {
        showNotify('warning', result.message || 'Không thể phát hành phần học');
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Lỗi khi phát hành phần học');
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ NGHIỆP VỤ SESSION
  // ==========================================

  const handleOpenCreateSession = (partId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetPartIdForSession(partId);
    setEditingSession(null);
    setSessionModalOpen(true);
  };

  const handleOpenEditSession = (session: AdminSessionResponse) => {
    setEditingSession(session);
    setTargetPartIdForSession(session.partId);
    setSessionModalOpen(true);
  };

  const handleOpenPreviewSession = (session: AdminSessionResponse) => {
    setPreviewSession(session);
    setPreviewModalOpen(true);
  };

  const handleSaveSession = async (data: AdminSessionRequest, publishNow: boolean) => {
    if (editingSession) {
      const id = editingSession.id;
      // Tách payload ra khỏi metadata request — endpoint /metadata không dùng payload
      // và việc gửi payload object gây lỗi deserialization ở backend
      const { payload: _stripPayload, ...metadataOnly } = data;

      if (publishNow) {
        // Lưu nháp trước, cập nhật metadata, rồi publish
        await adminCourseApi.saveSessionDraft(id, data);
        await adminCourseApi.updateSessionMetadata(id, metadataOnly as AdminSessionRequest);
        const result = await adminCourseApi.publishSession(id);
        if (result.valid) {
          showNotify('success', `Đã phát hành bài học "${data.title}" trực tuyến!`);
        } else {
          showNotify('warning', result.message || 'Lưu thành công nhưng phát hành thất bại');
        }
      } else {
        // Lưu nháp trước (thao tác cốt lõi), rồi cập nhật metadata
        await adminCourseApi.saveSessionDraft(id, data);
        await adminCourseApi.updateSessionMetadata(id, metadataOnly as AdminSessionRequest);
        showNotify('success', `Đã lưu bản nháp cho bài học "${data.title}" an toàn`);
      }
      loadSessions(editingSession.partId);
    } else if (targetPartIdForSession) {
      // Tạo mới session
      const created = await adminCourseApi.createSession(targetPartIdForSession, data);
      if (publishNow) {
        const pubResult = await adminCourseApi.publishSession(created.id);
        if (pubResult.valid) {
          showNotify('success', `Đã tạo và phát hành bài học "${data.title}" thành công!`);
        } else {
          showNotify('warning', pubResult.message || 'Đã tạo bài học ở dạng nháp');
        }
      } else {
        showNotify('success', `Đã tạo bài học "${data.title}" (Bản nháp)`);
      }
      loadSessions(targetPartIdForSession);
    }
    // Cập nhật lại Part và Topic để cập nhật sessionCount
    if (editingSession?.partId || targetPartIdForSession) {
      const pId = editingSession?.partId || targetPartIdForSession;
      if (pId) {
        const topic = topics.find((t) => partsMap[t.id]?.some((p) => p.id === pId));
        if (topic) loadParts(topic.id);
      }
    }
  };

  const handlePublishSessionQuick = async (session: AdminSessionResponse) => {
    setActionLoading(true);
    try {
      const result = await adminCourseApi.publishSession(session.id);
      if (result.valid) {
        showNotify('success', `Đã phát hành bài học "${session.title}" thành công!`);
        loadSessions(session.partId);
      } else {
        showNotify('warning', result.message || 'Không thể phát hành bài học');
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Lỗi khi phát hành bài học');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDiscardSessionDraft = async (session: AdminSessionResponse) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy bỏ bản nháp của "${session.title}" và quay lại bản Live?`)) {
      return;
    }
    setActionLoading(true);
    try {
      await adminCourseApi.discardSessionDraft(session.id);
      showNotify('success', `Đã hủy bản nháp. Bài học "${session.title}" quay về bản Live.`);
      loadSessions(session.partId);
    } catch (err: any) {
      showNotify('error', err.message || 'Lỗi khi hủy bản nháp');
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // XỬ LÝ XÓA AN TOÀN (CONFIRM DELETE & AUTO-BRIDGE)
  // ==========================================

  // Luôn mở hộp thoại xác nhận trước khi xóa
  const handlePromptDelete = (
    id: number,
    title: string,
    itemType: 'Topic' | 'Part' | 'Session',
    parentTopicId?: number,
    parentPartId?: number
  ) => {
    setDeleteTarget({ id, title, itemType, parentTopicId, parentPartId });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      // Gọi API xóa lần đầu
      let result: DeleteResult;
      if (deleteTarget.itemType === 'Topic') {
        result = await adminCourseApi.deleteTopic(deleteTarget.id);
      } else if (deleteTarget.itemType === 'Part') {
        result = await adminCourseApi.deletePart(deleteTarget.id);
      } else {
        result = await adminCourseApi.deleteSession(deleteTarget.id);
      }

      if (result.deleted) {
        // Xóa thành công
        if (deleteTarget.itemType === 'Topic' && selectedLevelId) loadTopics(selectedLevelId);
        if (deleteTarget.itemType === 'Part' && deleteTarget.parentTopicId) loadParts(deleteTarget.parentTopicId);
        if (deleteTarget.itemType === 'Session' && deleteTarget.parentPartId) loadSessions(deleteTarget.parentPartId);
        showNotify('success', `Đã xóa "${deleteTarget.title}" thành công`);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      } else if (result.requiresConfirmation) {
        // Backend yêu cầu xác nhận lần 2 (có ảnh hưởng học sinh) — gọi lại với token
        const token = result.confirmationToken;
        let finalResult: DeleteResult;
        if (deleteTarget.itemType === 'Topic') {
          finalResult = await adminCourseApi.deleteTopic(deleteTarget.id, token);
          if (selectedLevelId) loadTopics(selectedLevelId);
        } else if (deleteTarget.itemType === 'Part') {
          finalResult = await adminCourseApi.deletePart(deleteTarget.id, token);
          if (deleteTarget.parentTopicId) loadParts(deleteTarget.parentTopicId);
        } else {
          finalResult = await adminCourseApi.deleteSession(deleteTarget.id, token);
          if (deleteTarget.parentPartId) loadSessions(deleteTarget.parentPartId);
        }
        showNotify('success', finalResult.message || `Đã xóa "${deleteTarget.title}" thành công`);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
    } catch (err: any) {
      showNotify('error', err.message || 'Lỗi khi xóa');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper render loại bài tập (SessionType)
  const renderSessionTypeBadge = (type: SessionType) => {
    const config: Record<string, { label: string; bg: string }> = {
      FLASHCARD: { label: 'Flashcard', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
      MATCH_WORD: { label: 'Nối từ', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      SPEAKING: { label: 'Luyện nói', bg: 'bg-rose-50 text-rose-700 border-rose-200' },
      RE_ORDER: { label: 'Xếp từ', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
      DRAG_DROP: { label: 'Kéo thả', bg: 'bg-teal-50 text-teal-700 border-teal-200' },
      GRAMMAR: { label: 'Ngữ pháp', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      FILL_IN_BLANK: { label: 'Điền từ', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
      RE_ORDER_SENTENCE: { label: 'Ghép câu', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
      SPEAKING_SENTENCE: { label: 'Nói câu', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
      CONVERSATION: { label: 'Hội thoại', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
    };
    const c = config[type] || { label: type, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${c.bg}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col space-y-6 max-w-7xl mx-auto w-full pb-16">
      {/* 1. Header Trang & Toast Alert */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 tracking-tight">
            Quản lý Bài học & Khóa học
          </h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1">
            Quản trị nội dung theo cây phân cấp Level → Topic → Part → Session kèm cơ chế Phát hành & Nháp an toàn
          </p>
        </div>

        <button
          onClick={() => {
            if (selectedLevelId) loadTopics(selectedLevelId);
          }}
          disabled={loadingTopics}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 active:scale-95 transition shadow-xs disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loadingTopics ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Thông báo Floating Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs font-semibold shadow-md animate-in slide-in-from-top duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* 2. WIDGET THỐNG KÊ (đồng bộ style Overview) */}
      {!loadingTopics && topics.length > 0 && (() => {
        const publishedCount = topics.filter((t) => t.badge === 'PUBLISHED').length;
        const draftCount = topics.filter((t) => t.badge === 'DRAFT').length;
        return (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Topic đã phát hành</span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-500">
                  <CloudArrowUpIcon className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 my-2">{publishedCount}</h3>
              <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-400">
                Tổng số chủ đề đang hiển thị cho người học
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Topic chưa phát hành</span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500">
                  <ExclamationCircleIcon className="w-5 h-5 stroke-[2.5]" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 my-2">{draftCount}</h3>
              <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-400">
                Chủ đề đang ở trạng thái nháp, chưa được phát hành
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. DANH SÁCH CHỦ ĐỀ — Tiêu đề + Bộ lọc */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Danh sách Chủ đề</h3>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateTopic}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Thêm Chủ đề</span>
          </button>
        </div>

        {/* Thanh lọc: Search + Trình độ + Chế độ xem */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1 min-w-[180px]">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={filterMode === 'draft-sessions' ? 'Tìm theo tên bài học...' : 'Tìm theo tên chủ đề...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Dropdown: Trình độ */}
          <select
            value={selectedLevelId ?? ''}
            onChange={(e) => setSelectedLevelId(Number(e.target.value))}
            disabled={loadingLevels}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition appearance-none cursor-pointer pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>{lvl.name} ({lvl.code})</option>
            ))}
          </select>

          {/* Dropdown: Chế độ xem */}
          <select
            value={filterMode}
            onChange={(e) => handleFilterChange(e.target.value as FilterMode)}
            disabled={loadingFilter}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition appearance-none cursor-pointer pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
          >
            <option value="all">Tất cả</option>
            <option value="draft-topics">Chủ đề có nháp</option>
            <option value="draft-sessions">Bài học nháp</option>
          </select>

          {loadingFilter && (
            <ArrowPathIcon className="w-4 h-4 animate-spin text-indigo-500 shrink-0" />
          )}
        </div>
      </div>

      {/* 4. NỘI DUNG DANH SÁCH */}
      {filterMode === 'draft-sessions' ? (
        /* ── Chế độ lọc: Danh sách phẳng các Session nháp ── */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DocumentMagnifyingGlassIcon className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-800">
                Tất cả Bài học nháp ({allDraftSessions.length})
              </h3>
            </div>
          </div>

          {loadingFilter ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-500">Đang quét tất cả bài học...</p>
            </div>
          ) : allDraftSessions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <CheckCircleIcon className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Không có bài học nháp nào</h4>
              <p className="text-xs text-slate-500">
                Tất cả bài học ở trình độ này đều đã được phát hành.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {allDraftSessions.map(({ session, topicTitle, topicId, partTitle, partId }) => (
                <div
                  key={session.id}
                  className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
                >
                  {/* Cột trái: Breadcrumb + Tên bài */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mb-1">
                      <span className="truncate max-w-[140px]" title={topicTitle}>{topicTitle}</span>
                      <ChevronRightIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[120px]" title={partTitle}>{partTitle}</span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        #{session.orderIndex}
                      </span>
                      <h6 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {session.title}
                      </h6>
                      {renderSessionTypeBadge(session.sessionType)}
                      <StatusBadge status={session.badge} size="sm" />
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        v{session.version}
                      </span>
                    </div>
                  </div>

                  {/* Cột phải: Nút hành động */}
                  <div className="shrink-0">
                    <SessionActionButtons
                      session={session}
                      onEdit={handleOpenEditSession}
                      onPreview={handleOpenPreviewSession}
                      onPublish={handlePublishSessionQuick}
                      onDiscardDraft={handleDiscardSessionDraft}
                      onDelete={() =>
                        handlePromptDelete(
                          session.id,
                          session.title,
                          'Session',
                          topicId,
                          partId
                        )
                      }
                      isLoading={actionLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
      /* ── Chế độ bình thường / lọc topic có nháp ── */
      <div className="space-y-4">
        {loadingTopics ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Đang nạp các chủ đề...</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            {filterMode === 'draft-topics' ? (
              <>
                <CheckCircleIcon className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Không có chủ đề nào chứa nháp</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tất cả chủ đề, phần học và bài học ở trình độ này đều đã được phát hành.
                </p>
              </>
            ) : (
              <>
                <BookOpenIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Chưa có chủ đề nào ở trình độ này</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hãy bấm "Thêm Chủ đề" để bắt đầu thiết lập lộ trình học tập cho học sinh.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic) => {
              const isTopicExpanded = expandedTopicIds.has(topic.id);
              const parts = partsMap[topic.id] || [];
              const isLoadingParts = loadingParts[topic.id];

              return (
                <div
                  key={topic.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition"
                >
                  {/* Topic Card Header */}
                  <div
                    onClick={() => toggleTopicExpand(topic.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 select-none transition"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg shrink-0"
                      >
                        {isTopicExpanded ? (
                          <ChevronDownIcon className="w-5 h-5" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5" />
                        )}
                      </button>

                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {topic.thumbnailUrl ? (
                          <img
                            src={topic.thumbnailUrl}
                            alt={topic.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <FolderIcon className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold text-slate-400">
                            #{topic.orderIndex}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-800 truncate">
                            {topic.title}
                          </h4>
                          <StatusBadge status={topic.badge} size="sm" />
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5 max-w-xl">
                          {topic.description || 'Không có mô tả'} • {topic.partCount} phần học • {topic.sessionCount} bài học
                        </p>
                      </div>
                    </div>

                    {/* Topic Actions */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {topic.badge === 'DRAFT' && (
                        <button
                          type="button"
                          onClick={(e) => handlePublishTopic(topic, e)}
                          disabled={actionLoading}
                          title="Phát hành chủ đề cho học sinh"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition disabled:opacity-50"
                        >
                          <CloudArrowUpIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">Phát hành</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleOpenCreatePart(topic.id, e)}
                        title="Thêm phần học con"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold active:scale-95 transition"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Thêm Part</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleOpenEditTopic(topic, e)}
                        title="Sửa thông tin chủ đề"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handlePromptDelete(topic.id, topic.title, 'Topic')
                        }
                        title="Xóa chủ đề"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 4. CẤP 3: DANH SÁCH PARTS (Bên trong Topic) */}
                  {isTopicExpanded && (
                    <div className="px-4 sm:px-6 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                      {isLoadingParts ? (
                        <div className="py-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                          <ArrowPathIcon className="w-4 h-4 animate-spin" /> Đang nạp các phần học...
                        </div>
                      ) : parts.length === 0 ? (
                        <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-2 bg-white">
                          <p className="text-xs text-slate-500">Chủ đề này chưa có Phần học (Part) nào.</p>
                          <button
                            type="button"
                            onClick={(e) => handleOpenCreatePart(topic.id, e)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                          >
                            <PlusIcon className="w-3.5 h-3.5" /> Thêm Phần học đầu tiên
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-2">
                          {parts.map((part) => {
                            const isPartExpanded = expandedPartIds.has(part.id);
                            const sessions = sessionsMap[part.id] || [];
                            const isLoadingSessions = loadingSessions[part.id];

                            return (
                              <div
                                key={part.id}
                                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
                              >
                                {/* Part Card Header */}
                                <div
                                  onClick={() => togglePartExpand(part.id)}
                                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/90 transition select-none"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <button
                                      type="button"
                                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded shrink-0"
                                    >
                                      {isPartExpanded ? (
                                        <ChevronDownIcon className="w-4 h-4" />
                                      ) : (
                                        <ChevronRightIcon className="w-4 h-4" />
                                      )}
                                    </button>

                                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                                      <Squares2X2Icon className="w-4 h-4" />
                                    </div>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[11px] font-bold text-slate-400">
                                          P#{part.orderIndex}
                                        </span>
                                        <h5 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                          {part.title}
                                        </h5>
                                        <StatusBadge status={part.badge} size="sm" />
                                      </div>
                                      <span className="text-[11px] text-slate-500">
                                        {part.sessionCount} bài học
                                      </span>
                                    </div>
                                  </div>

                                  {/* Part Actions */}
                                  <div
                                    className="flex items-center gap-1.5 shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {part.badge === 'DRAFT' && (
                                      <button
                                        type="button"
                                        onClick={(e) => handlePublishPart(part, e)}
                                        disabled={actionLoading}
                                        title="Phát hành phần học"
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition"
                                      >
                                        <CloudArrowUpIcon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Phát hành</span>
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => handleOpenCreateSession(part.id, e)}
                                      title="Thêm bài học con"
                                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition"
                                    >
                                      <PlusIcon className="w-3.5 h-3.5" />
                                      <span className="hidden sm:inline">Thêm Bài</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => handleOpenEditPart(part, e)}
                                      title="Sửa tên phần học"
                                      className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                    >
                                      <PencilSquareIcon className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handlePromptDelete(part.id, part.title, 'Part', topic.id)
                                      }
                                      title="Xóa phần học"
                                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                    >
                                      <TrashIcon className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* 5. CẤP 4: DANH SÁCH SESSIONS (Bên trong Part) */}
                                {isPartExpanded && (
                                  <div className="px-3.5 sm:px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50/30 space-y-2">
                                    {isLoadingSessions ? (
                                      <div className="py-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                                        <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> Đang tải bài học...
                                      </div>
                                    ) : sessions.length === 0 ? (
                                      <div className="py-4 text-center border-2 border-dashed border-slate-200 rounded-xl space-y-1.5 bg-white">
                                        <p className="text-[11px] text-slate-500">Phần này chưa có bài học nào.</p>
                                        <button
                                          type="button"
                                          onClick={(e) => handleOpenCreateSession(part.id, e)}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition"
                                        >
                                          <PlusIcon className="w-3 h-3" /> Thêm Bài học đầu tiên
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="space-y-2.5 pt-1">
                                        {sessions.map((session) => (
                                          <div
                                            key={session.id}
                                            className="p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs transition flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
                                          >
                                            {/* Cột trái: Tên & Badge bài học */}
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-2.5 flex-wrap">
                                                <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                  #{session.orderIndex}
                                                </span>
                                                <h6 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                                  {session.title}
                                                </h6>
                                                {renderSessionTypeBadge(session.sessionType)}
                                                <StatusBadge status={session.badge} size="sm" />
                                                <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                                  v{session.version}
                                                </span>
                                              </div>
                                            </div>

                                            {/* Cột phải: Ma trận nút hành động */}
                                            <div className="shrink-0">
                                              <SessionActionButtons
                                                session={session}
                                                onEdit={handleOpenEditSession}
                                                onPreview={handleOpenPreviewSession}
                                                onPublish={handlePublishSessionQuick}
                                                onDiscardDraft={handleDiscardSessionDraft}
                                                onDelete={() =>
                                                  handlePromptDelete(
                                                    session.id,
                                                    session.title,
                                                    'Session',
                                                    topic.id,
                                                    part.id
                                                  )
                                                }
                                                isLoading={actionLoading}
                                              />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* ========================================== */}
      {/* CÁC MODALS QUẢN TRỊ                        */}
      {/* ========================================== */}

      {/* Modal 1: Topic Form Modal */}
      {selectedLevelId && (
        <TopicFormModal
          isOpen={topicModalOpen}
          onClose={() => setTopicModalOpen(false)}
          topic={editingTopic}
          levelId={selectedLevelId}
          onSave={handleSaveTopic}
        />
      )}

      {/* Modal 2: Part Form Modal */}
      {targetTopicIdForPart && (
        <PartFormModal
          isOpen={partModalOpen}
          onClose={() => setPartModalOpen(false)}
          part={editingPart}
          topicId={targetTopicIdForPart}
          onSave={handleSavePart}
        />
      )}

      {/* Modal 3: Session Form Modal (TASK-12) */}
      <SessionFormModal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        session={editingSession}
        partId={targetPartIdForSession || undefined}
        onSave={handleSaveSession}
      />

      {/* Modal 4: Preview Modal (TASK-13) */}
      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        session={previewSession}
      />

      {/* Modal 5: Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteTarget(null);
          }}
          title={deleteTarget.title}
          itemType={deleteTarget.itemType}
          deleteResult={deleteTarget.result}
          onConfirm={handleConfirmDelete}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default AdminLessons;
