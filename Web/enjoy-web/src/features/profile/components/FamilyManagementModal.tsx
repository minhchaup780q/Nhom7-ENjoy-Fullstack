import React, { useState } from 'react';
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

interface FamilyManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isParent: boolean;
  userEmail?: string;
}

export const FamilyManagementModal: React.FC<FamilyManagementModalProps> = ({
  isOpen,
  onClose,
  isParent,
  userEmail,
}) => {
  // Parent state
  const [childEmail, setChildEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [parentSuccessMsg, setParentSuccessMsg] = useState<string | null>(null);
  const [parentErrorMsg, setParentErrorMsg] = useState<string | null>(null);

  // Mock data for parent
  const [linkedChildren, setLinkedChildren] = useState([
    { id: 1, name: 'Học sinh Nguyễn Văn An', email: 'an.student@gmail.com', joinedDate: '15/08/2026', status: 'LINKED' },
  ]);
  const [pendingInvites, setPendingInvites] = useState([
    { id: 2, email: 'bin.study@gmail.com', sentAt: '10 phút trước', status: 'PENDING' },
  ]);

  // Child state
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [childSuccessMsg, setChildSuccessMsg] = useState<string | null>(null);
  const [childErrorMsg, setChildErrorMsg] = useState<string | null>(null);

  // Mock data for child
  const [linkedParents, setLinkedParents] = useState([
    { id: 101, name: 'Phụ huynh Nguyễn Văn Bình', email: 'ba.nguyen@gmail.com', role: 'Phụ huynh chính' }
  ]);
  const [pendingParentInvite, setPendingParentInvite] = useState<{
    id: number;
    parentEmail: string;
    sentTime: string;
  } | null>({
    id: 201,
    parentEmail: 'me.lan@gmail.com',
    sentTime: '15 phút trước',
  });

  if (!isOpen) return null;

  // Handler for Parent sending invitation
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setParentErrorMsg(null);
    setParentSuccessMsg(null);

    if (!childEmail.trim()) {
      setParentErrorMsg('Vui lòng nhập địa chỉ Email của con.');
      return;
    }

    if (childEmail.trim().toLowerCase() === userEmail?.toLowerCase()) {
      setParentErrorMsg('Không thể gửi lời mời liên kết đến chính email của bạn.');
      return;
    }

    setSendingInvite(true);
    setTimeout(() => {
      setPendingInvites(prev => [
        ...prev,
        { id: Date.now(), email: childEmail.trim(), sentAt: 'Vừa xong', status: 'PENDING' }
      ]);
      setParentSuccessMsg(`Đã gửi mã xác nhận 6 số đến ${childEmail.trim()}! Bé hãy đăng nhập ENjoy và nhập mã để xác nhận.`);
      setChildEmail('');
      setSendingInvite(false);
    }, 800);
  };

  // Handler for Child verifying invitation code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setChildErrorMsg(null);
    setChildSuccessMsg(null);

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setChildErrorMsg('Vui lòng nhập đúng mã xác thực 6 chữ số được gửi trong Email.');
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      if (pendingParentInvite) {
        setLinkedParents(prev => [
          ...prev,
          { id: pendingParentInvite.id, name: 'Phụ huynh', email: pendingParentInvite.parentEmail, role: 'Đã liên kết' }
        ]);
        setPendingParentInvite(null);
      }
      setChildSuccessMsg('Liên kết tài khoản gia đình thành công! Ba mẹ đã có thể cùng bạn theo dõi quá trình học.');
      setVerificationCode('');
      setVerifying(false);
    }, 800);
  };

  const handleRemoveChild = (id: number) => {
    setLinkedChildren(prev => prev.filter(item => item.id !== id));
  };

  const handleCancelInvite = (id: number) => {
    setPendingInvites(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl border-4 border-border-main shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header (Tone hồng Duolingo & Slate hài hòa chuẩn thương hiệu ENjoy) */}
        <div className="p-6 border-b-2 border-border-main flex items-center justify-between bg-gradient-to-r from-primary-soft/60 via-white to-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shadow-inner border border-primary/20">
              {isParent ? (
                <HeartIcon className="w-7 h-7 stroke-[2.5]" />
              ) : (
                <UserGroupIcon className="w-7 h-7 stroke-[2.5]" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-[#2b2b2b] uppercase tracking-wide">
                {isParent ? 'Quản Lý Gia Đình & Trẻ Em' : 'Liên Kết Gia Đình Cùng Phụ Huynh'}
              </h2>
              <p className="text-xs font-semibold text-text-muted">
                {isParent 
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
          
          {/* ======================= GIAO DIỆN PHỤ HUYNH ======================= */}
          {isParent ? (
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
                            <p className="text-xs font-bold text-[#2b2b2b]">{invite.email}</p>
                            <p className="text-[10px] font-semibold text-primary">Đã gửi {invite.sentAt} • Đang chờ nhập mã</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCancelInvite(invite.id)}
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
                  Danh sách tài khoản con đã liên kết ({linkedChildren.length})
                </h4>

                {linkedChildren.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-border-main rounded-2xl">
                    <p className="text-xs font-semibold text-text-muted">Chưa có tài khoản con nào được liên kết.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linkedChildren.map(child => (
                      <div key={child.id} className="bg-white border-2 border-border-main rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-primary/40 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                            <AcademicCapIcon className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-display font-black text-[#2b2b2b]">{child.name}</p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Đã kết nối
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-text-muted">{child.email} • Liên kết từ {child.joinedDate}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveChild(child.id)}
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
                  {pendingParentInvite && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-display font-black bg-primary-soft text-primary border border-primary/20">
                      1 Lời mời mới
                    </span>
                  )}
                </div>

                {pendingParentInvite ? (
                  <div className="bg-gradient-to-br from-primary-soft/40 via-white to-slate-50 border-2 border-primary/30 rounded-3xl p-5 shadow-sm space-y-4">
                    {/* Header thông tin lời mời */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-primary-soft text-primary flex items-center justify-center shrink-0 shadow-inner border border-primary/20">
                        <UserGroupIcon className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-display font-black text-[#2b2b2b]">
                            Lời mời từ: <span className="text-primary font-black">{pendingParentInvite.parentEmail}</span>
                          </h3>
                          <span className="text-[10px] font-semibold text-text-muted bg-white px-2 py-0.5 rounded-full border border-border-main">
                            {pendingParentInvite.sentTime}
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
                            onClick={() => {
                              setPendingParentInvite(null);
                              setChildErrorMsg(null);
                            }}
                            className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition cursor-pointer"
                          >
                            Từ chối
                          </button>
                        </div>
                      </div>
                    </form>
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
                  Phụ huynh đã liên kết ({linkedParents.length})
                </h4>

                {linkedParents.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-border-main rounded-2xl">
                    <p className="text-xs font-semibold text-text-muted">Chưa có phụ huynh nào được liên kết.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {linkedParents.map(parent => (
                      <div key={parent.id} className="bg-white border-2 border-border-main rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-primary/40 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary/20">
                            <UserIcon className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-display font-black text-[#2b2b2b]">{parent.name}</p>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Đã kết nối
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-text-muted">{parent.email}</p>
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
