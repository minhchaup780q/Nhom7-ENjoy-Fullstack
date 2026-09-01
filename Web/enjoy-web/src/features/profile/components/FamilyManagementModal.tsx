import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  TrashIcon, 
  ArrowPathIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  AcademicCapIcon,
  UserIcon,
  InformationCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { Button3D } from '../../../components/ui/Button3D';
import { familyApi, type FamilyMember } from '../services/familyApi';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { ApiError } from '../../../services/apiClient';

interface FamilyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isParent?: boolean;
  userEmail?: string;
}

export const FamilyManagementModal: React.FC<FamilyManagementModalProps> = ({
  isOpen,
  onClose,
  isParent: propIsParent,
  userEmail: propUserEmail,
}) => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [currentRole, setCurrentRole] = useState<string | undefined>(user?.role);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(user?.email || propUserEmail);

  const [loading, setLoading] = useState(false);
  const [linkedMembers, setLinkedMembers] = useState<FamilyMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<FamilyMember[]>([]);

  // Parent state
  const [childEmail, setChildEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [parentSuccessMsg, setParentSuccessMsg] = useState<string | null>(null);
  const [parentErrorMsg, setParentErrorMsg] = useState<string | null>(null);

  // Child state
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [childSuccessMsg, setChildSuccessMsg] = useState<string | null>(null);
  const [childErrorMsg, setChildErrorMsg] = useState<string | null>(null);

  const actualIsParent = (currentRole ?? user?.role ?? (propIsParent ? 'ROLE_PARENT' : 'ROLE_CHILDREN')) === 'ROLE_PARENT';

  useEffect(() => {
    if (isOpen) {
      fetchFamilyOverview();
      setParentErrorMsg(null);
      setParentSuccessMsg(null);
      setChildErrorMsg(null);
      setChildSuccessMsg(null);
      setChildEmail('');
      setVerificationCode('');
    }
  }, [isOpen]);

  const fetchFamilyOverview = async () => {
    setLoading(true);
    try {
      // 1. Luôn đồng bộ profile mới nhất từ server để cập nhật role chuẩn xác theo ngày sinh
      try {
        const latestProfile = await profileApi.getProfile();
        if (latestProfile && latestProfile.role) {
          setCurrentRole(latestProfile.role);
          if (latestProfile.email) setCurrentUserEmail(latestProfile.email);
          if (user && accessToken && (user.role !== latestProfile.role || user.username !== latestProfile.username)) {
            setAuth(
              {
                ...user,
                username: latestProfile.username,
                role: latestProfile.role,
              },
              accessToken
            );
          }
        }
      } catch (profileErr) {
        console.warn("Không thể fetch profile mới nhất:", profileErr);
      }

      // 2. Fetch danh sách liên kết gia đình
      const data = await familyApi.getOverview();
      setLinkedMembers(data.linkedMembers || []);
      setPendingInvites(data.pendingInvites || []);
    } catch (err: any) {
      console.warn("Không thể tải danh sách gia đình từ server:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler for Parent sending invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setParentErrorMsg(null);
    setParentSuccessMsg(null);

    if (!childEmail.trim()) {
      setParentErrorMsg('Vui lòng nhập địa chỉ Email của con.');
      return;
    }

    if (childEmail.trim().toLowerCase() === currentUserEmail?.toLowerCase()) {
      setParentErrorMsg('Không thể gửi lời mời liên kết đến chính email của bạn.');
      return;
    }

    setSendingInvite(true);
    try {
      await familyApi.sendInvite(childEmail.trim());
      setParentSuccessMsg(`Đã gửi mã xác nhận 6 số đến ${childEmail.trim()}! Bé hãy đăng nhập ENjoy và nhập mã để xác nhận.`);
      setChildEmail('');
      await fetchFamilyOverview();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setParentErrorMsg(err.message || 'Không thể gửi lời mời. Vui lòng thử lại sau.');
      } else {
        setParentErrorMsg(err.message || 'Lỗi gửi lời mời. Vui lòng kiểm tra lại địa chỉ email.');
      }
    } finally {
      setSendingInvite(false);
    }
  };

  // Handler for Child verifying invitation code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setChildErrorMsg(null);
    setChildSuccessMsg(null);

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setChildErrorMsg('Vui lòng nhập đúng mã xác thực 6 chữ số được gửi trong Email.');
      return;
    }

    setVerifying(true);
    try {
      await familyApi.verifyInvite(verificationCode.trim());
      setChildSuccessMsg('Liên kết tài khoản gia đình thành công! Ba mẹ đã có thể cùng bạn theo dõi quá trình học.');
      setVerificationCode('');
      await fetchFamilyOverview();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setChildErrorMsg(err.message || 'Mã xác nhận không đúng hoặc đã hết hạn.');
      } else {
        setChildErrorMsg(err.message || 'Lỗi xác nhận mã. Vui lòng thử lại.');
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleRemoveLink = async (id: number) => {
    try {
      await familyApi.cancelOrRemoveLink(id);
      await fetchFamilyOverview();
    } catch (err: any) {
      console.error("Lỗi xóa liên kết:", err);
    }
  };

  const handleRejectInvite = async (id: number) => {
    try {
      await familyApi.rejectInvite(id);
      await fetchFamilyOverview();
    } catch (err: any) {
      console.error("Lỗi từ chối lời mời:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl border-4 border-border-main shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-gradient-to-r from-primary-soft/60 via-white to-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shadow-inner border border-primary/20">
              {actualIsParent ? (
                <HeartIcon className="w-7 h-7 stroke-[2.5]" />
              ) : (
                <UserGroupIcon className="w-7 h-7 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-[#2b2b2b] uppercase tracking-wide">
                {actualIsParent ? 'Quản Lý Gia Đình & Trẻ Em' : 'Liên Kết Gia Đình Cùng Phụ Huynh'}
              </h2>
              <p className="text-xs font-semibold text-text-muted">
                {actualIsParent 
                  ? 'Gửi lời mời và liên kết tài khoản của các con để đồng hành học tập'
                  : 'Kết nối tài khoản với phụ huynh để nhận hỗ trợ học tập tốt nhất'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl text-text-muted hover:text-[#2b2b2b] hover:bg-slate-100 transition cursor-pointer"
            title="Đóng"
          >
            <XMarkIcon className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <ArrowPathIcon className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs font-display font-bold text-text-muted">Đang tải dữ liệu gia đình...</p>
            </div>
          ) : actualIsParent ? (
            /* ======================= GIAO DIỆN PHỤ HUYNH ======================= */
            <div className="space-y-6">
              
              {/* Form Gửi lời mời */}
              <div className="bg-[#f8f9fa] border-2 border-border-main rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-primary stroke-[2.5]" />
                  <h3 className="text-sm font-display font-black text-[#2b2b2b] uppercase">
                    Thêm tài khoản của con vào gia đình
                  </h3>
                </div>

                {parentErrorMsg && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                    {parentErrorMsg}
                  </div>
                )}

                {parentSuccessMsg && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                    {parentSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={childEmail}
                      onChange={(e) => setChildEmail(e.target.value)}
                      placeholder="Nhập địa chỉ Gmail của con (VD: hocsinh@gmail.com)..."
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-border-main rounded-2xl text-sm font-semibold text-[#2b2b2b] focus:border-primary outline-none transition"
                    />
                    <EnvelopeIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                  </div>

                  <Button3D
                    type="submit"
                    variant="pink"
                    size="md"
                    disabled={sendingInvite}
                    className="flex items-center justify-center gap-2 shrink-0"
                  >
                    {sendingInvite ? (
                      <ArrowPathIcon className="w-4 h-4 animate-spin stroke-[2.5]" />
                    ) : (
                      <PaperAirplaneIcon className="w-4 h-4 stroke-[2.5]" />
                    )}
                    GỬI LỜI MỜI
                  </Button3D>
                </form>

                <div className="flex items-start gap-2.5 text-[11px] text-text-muted font-medium bg-white p-3 rounded-2xl border border-border-main">
                  <InformationCircleIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Quy trình:</strong> Hệ thống sẽ gửi 1 mã xác thực 6 số đến Gmail của con. Con chỉ cần đăng nhập ENjoy và nhập mã vào mục Liên kết gia đình để xác nhận.
                  </span>
                </div>
              </div>

              {/* Danh sách lời mời đang chờ */}
              {pendingInvites.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-display font-black text-[#2b2b2b] uppercase flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-primary" />
                    Lời mời đang chờ xác nhận ({pendingInvites.length})
                  </h4>

                  <div className="space-y-2">
                    {pendingInvites.map(invite => (
                      <div key={invite.id} className="bg-[#fdf8f9] border-2 border-primary/20 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0 border border-primary/20">
                            <EnvelopeIcon className="w-4 h-4 stroke-[2.5]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2b2b2b]">{invite.studentEmail}</p>
                            <p className="text-[10px] font-semibold text-primary">Đang chờ con mở email và nhập mã xác thực</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLink(invite.id)}
                          className="px-3 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition cursor-pointer"
                        >
                          Hủy lời mời
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Danh sách con đã liên kết */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-display font-black text-[#2b2b2b] uppercase flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Danh sách tài khoản con đã liên kết ({linkedMembers.length})
                </h4>

                {linkedMembers.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-border-main rounded-2xl">
                    <p className="text-xs font-semibold text-text-muted">Chưa có tài khoản con nào được liên kết.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linkedMembers.map(child => (
                      <div key={child.id} className="bg-white border-2 border-border-main rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-primary/40 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                            <AcademicCapIcon className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-display font-black text-[#2b2b2b]">{child.studentName || 'Học sinh'}</p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Đã kết nối
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-text-muted">{child.studentEmail}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveLink(child.id)}
                          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition cursor-pointer"
                          title="Hủy liên kết"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* ======================= GIAO DIỆN HỌC SINH ======================= */
            <div className="space-y-6">
              
              {/* Lời mời đang chờ bé đồng ý (Chứa form nhập mã xác thực bên trong) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-display font-black text-[#2b2b2b] uppercase flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-primary" />
                    Lời mời liên kết từ Phụ huynh
                  </h4>
                  {pendingInvites.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-display font-black bg-primary-soft text-primary border border-primary/20">
                      {pendingInvites.length} Lời mời mới
                    </span>
                  )}
                </div>

                {pendingInvites.length > 0 ? (
                  <div className="space-y-4">
                    {pendingInvites.map(invite => (
                      <div key={invite.id} className="bg-gradient-to-br from-primary-soft/40 via-white to-slate-50 border-2 border-primary/30 rounded-3xl p-5 shadow-sm space-y-4">
                        {/* Header thông tin lời mời */}
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shrink-0 shadow-inner border border-primary/20">
                            <UserGroupIcon className="w-6 h-6 stroke-[2.5]" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-sm font-display font-black text-[#2b2b2b]">
                                Lời mời từ: <span className="text-primary font-black">{invite.parentName || invite.parentEmail}</span>
                              </h3>
                              <span className="text-[10px] font-semibold text-text-muted bg-white px-2 py-0.5 rounded-full border border-border-main">
                                {invite.parentEmail}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-text-main leading-relaxed">
                              Phụ huynh muốn liên kết tài khoản để cùng bạn theo dõi tiến độ học tiếng Anh. Vui lòng mở Gmail lấy mã xác thực 6 số và nhập vào ô bên dưới:
                            </p>
                          </div>
                        </div>

                        {/* Feedback Messages */}
                        {childErrorMsg && (
                          <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                            {childErrorMsg}
                          </div>
                        )}

                        {childSuccessMsg && (
                          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                            {childSuccessMsg}
                          </div>
                        )}

                        {/* Form nhập mã trực tiếp trong card lời mời */}
                        <form onSubmit={handleVerifyCode} className="bg-white border-2 border-border-main rounded-2xl p-4 space-y-3 shadow-sm">
                          <label className="block text-xs font-display font-black text-[#2b2b2b] uppercase">
                            Nhập mã xác nhận (6 chữ số từ Email):
                          </label>

                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                maxLength={6}
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase())}
                                placeholder="VD: 849201"
                                className="w-full px-4 py-2.5 bg-[#f8f9fa] border-2 border-border-main rounded-xl text-center text-base font-display font-black tracking-widest text-[#2b2b2b] focus:border-primary focus:bg-white outline-none transition"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Button3D
                                type="submit"
                                variant="green"
                                size="sm"
                                disabled={verifying}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2"
                              >
                                {verifying ? (
                                  <ArrowPathIcon className="w-4 h-4 animate-spin stroke-[2.5]" />
                                ) : (
                                  <CheckCircleIcon className="w-4 h-4 stroke-[2.5]" />
                                )}
                                XÁC NHẬN LIÊN KẾT
                              </Button3D>

                              <button
                                type="button"
                                onClick={() => handleRejectInvite(invite.id)}
                                className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition cursor-pointer"
                              >
                                Từ chối
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-border-main rounded-3xl bg-[#f8f9fa] space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-border-main text-slate-400 flex items-center justify-center mx-auto shadow-sm">
                      <EnvelopeIcon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <p className="text-xs font-display font-black text-[#2b2b2b]">
                      Hiện không có lời mời liên kết nào
                    </p>
                    <p className="text-[11px] font-medium text-text-muted max-w-sm mx-auto">
                      Khi phụ huynh nhập Gmail của bạn và gửi lời mời, thông tin và ô nhập mã xác nhận sẽ xuất hiện tại đây.
                    </p>
                  </div>
                )}
              </div>

              {/* Danh sách phụ huynh đã liên kết */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-display font-black text-[#2b2b2b] uppercase flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                  Phụ huynh đã liên kết ({linkedMembers.length})
                </h4>

                {linkedMembers.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-border-main rounded-2xl">
                    <p className="text-xs font-semibold text-text-muted">Chưa có phụ huynh nào được liên kết.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linkedMembers.map(parent => (
                      <div key={parent.id} className="bg-white border-2 border-border-main rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-primary/40 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                            <UserIcon className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-display font-black text-[#2b2b2b]">{parent.parentName || 'Phụ huynh'}</p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Đã kết nối
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-text-muted">{parent.parentEmail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t-2 border-border-main bg-[#f8f9fa] flex justify-end">
          <Button3D variant="gray" size="sm" onClick={onClose}>
            ĐÓNG
          </Button3D>
        </div>

      </div>
    </div>
  );
};
