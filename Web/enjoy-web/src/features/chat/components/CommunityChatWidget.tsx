import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { getChatSocket } from '../services/chatSocket';
import { apiClient } from '../../../services/apiClient';
import type { ChatMessage, ChatPageResponse } from '../types';

export const CommunityChatWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputText, setInputText] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [oldestId, setOldestId] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrolledToBottomRef = useRef(true);

  // Cuộn xuống cuối danh sách tin nhắn
  const scrollToBottom = useCallback((smooth = false) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  // 1. Tải 30 tin nhắn mới nhất ban đầu
  const loadInitialMessages = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await apiClient.get<ChatPageResponse>('/api/community-chat/messages', {
        params: { limit: 30 },
      });

      if (res && res.messages) {
        setMessages(res.messages);
        setHasMore(res.hasMore);
        setOldestId(res.oldestId);
        setTimeout(() => scrollToBottom(false), 50);
      }
    } catch (err) {
      console.warn('[Chat] Lỗi khi tải tin nhắn từ REST API, thử lấy qua Socket...', err);
      // Fallback: Yêu cầu qua socket
      const socket = getChatSocket();
      socket.emit('community:get_history', { limit: 30 }, (response: any) => {
        if (response?.success && response.messages) {
          setMessages(response.messages);
          setTimeout(() => scrollToBottom(false), 50);
        }
      });
    } finally {
      setLoadingHistory(false);
    }
  }, [scrollToBottom]);

  // 2. Tải thêm 30 tin nhắn cũ hơn khi cuộn lên trên cùng
  const loadMoreOlderMessages = useCallback(async () => {
    if (!hasMore || loadingMore || !oldestId || !scrollRef.current) return;

    setLoadingMore(true);
    const container = scrollRef.current;
    const prevScrollHeight = container.scrollHeight;

    try {
      const res = await apiClient.get<ChatPageResponse>('/api/community-chat/messages', {
        params: { beforeId: oldestId, limit: 30 },
      });

      if (res && res.messages && res.messages.length > 0) {
        setMessages((prev) => [...res.messages, ...prev]);
        setHasMore(res.hasMore);
        setOldestId(res.oldestId);

        // Khôi phục vị trí cuộn mượt mà để tránh bị giật màn hình
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight;
          }
        });
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('[Chat] Lỗi khi tải thêm tin nhắn cũ:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, oldestId]);

  // 3. Xử lý sự kiện cuộn
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // Kiểm tra xem người dùng có đang ở sát đáy không
    isScrolledToBottomRef.current = scrollHeight - (scrollTop + clientHeight) < 80;

    // Nếu cuộn lên gần đỉnh (<= 30px) thì tự động load thêm 30 tin cũ hơn
    if (scrollTop <= 30 && hasMore && !loadingMore && oldestId) {
      loadMoreOlderMessages();
    }
  };

  // 4. Kết nối và Lắng nghe Socket.IO
  useEffect(() => {
    const socket = getChatSocket();

    // Nhận tin nhắn mới broadcast từ server
    const handleNewMessage = (newMsg: ChatMessage) => {
      setMessages((prev) => {
        // Tránh trùng lặp tin nhắn nếu id giống nhau
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });

      setIsOpen((open) => {
        if (!open) {
          setUnreadCount((count) => count + 1);
        } else if (isScrolledToBottomRef.current) {
          setTimeout(() => scrollToBottom(true), 50);
        }
        return open;
      });
    };

    // Cập nhật số người online
    const handleOnlineCount = (data: { onlineCount: number }) => {
      if (data?.onlineCount) setOnlineCount(data.onlineCount);
    };

    // Nhận thông báo người đang soạn tin
    const handleUserTyping = (data: { userId: number; username: string }) => {
      if (data.userId !== user?.id && data.username) {
        setTypingUsers((prev) => Array.from(new Set([...prev, data.username])));
      }
    };

    const handleUserStopTyping = (data: { userId: number }) => {
      if (data.userId !== user?.id) {
        setTypingUsers([]);
      }
    };

    const handleError = (data: { message: string }) => {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(null), 3500);
    };

    socket.on('community:new_message', handleNewMessage);
    socket.on('community:online_count', handleOnlineCount);
    socket.on('community:user_typing', handleUserTyping);
    socket.on('community:user_stop_typing', handleUserStopTyping);
    socket.on('community:error', handleError);

    return () => {
      socket.off('community:new_message', handleNewMessage);
      socket.off('community:online_count', handleOnlineCount);
      socket.off('community:user_typing', handleUserTyping);
      socket.off('community:user_stop_typing', handleUserStopTyping);
      socket.off('community:error', handleError);
    };
  }, [user, scrollToBottom]);

  // Khi mở cửa sổ chat
  const handleToggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setUnreadCount(0);
      if (messages.length === 0) {
        loadInitialMessages();
      } else {
        setTimeout(() => scrollToBottom(false), 50);
      }
    } else {
      setIsOpen(false);
    }
  };

  // Cooldown timer đếm ngược 1s
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Gửi tin nhắn
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || cooldown > 0) return;

    if (!isAuthenticated || !user) {
      setErrorMessage('Vui lòng đăng nhập để tham gia chat cộng đồng!');
      return;
    }

    const socket = getChatSocket();
    const payload = {
      userId: user.id,
      username: user.username || user.name || `Người dùng #${user.id}`,
      avatarUrl: (user as any).avatarUrl || null,
      content: inputText.trim(),
    };

    socket.emit('community:send_message', payload);
    socket.emit('community:stop_typing', { userId: user.id });

    setInputText('');
    setCooldown(1); // Cooldown 1 giây chống spam
    setTimeout(() => scrollToBottom(true), 50);
  };

  // Xử lý Typing Indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (user) {
      const socket = getChatSocket();
      socket.emit('community:typing', {
        userId: user.id,
        username: user.username || user.name,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('community:stop_typing', { userId: user.id });
      }, 1500);
    }
  };

  // Định dạng giờ gửi tin nhắn (VD: 14:35)
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none font-sans">
      {/* 1. CỬA SỔ CHAT MỞ RỘNG */}
      {isOpen && (
        <div className="w-96 h-[530px] max-w-[calc(100vw-2.5rem)] max-h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 text-white px-4 py-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-2">
                  Cộng đồng ENjoy
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/25 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {onlineCount} online
                  </span>
                </h3>
                <p className="text-[11px] text-sky-100/90 font-medium">Giao lưu & học tập cùng nhau</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-white/15 flex items-center justify-center text-white/90 transition-all cursor-pointer"
                title="Thu nhỏ"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
            </div>
          </div>

          {/* BODY: DANH SÁCH TIN NHẮN */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/70"
          >
            {/* VÙNG THÔNG BÁO TẢI THÊM 30 TIN CŨ */}
            <div className="text-center py-1">
              {loadingMore ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 shadow-2xs">
                  <span className="w-3.5 h-3.5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  Đang tải 30 tin nhắn cũ hơn...
                </div>
              ) : hasMore ? (
                <button
                  onClick={loadMoreOlderMessages}
                  className="text-[11px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-full border border-sky-200 transition-all cursor-pointer"
                >
                  ↑ Kéo lên hoặc nhấn để tải tin cũ hơn
                </button>
              ) : (
                <div className="text-[11px] font-medium text-slate-400">
                  🎉 Đây là điểm bắt đầu của cuộc trò chuyện cộng đồng
                </div>
              )}
            </div>

            {/* SKELETON KHI TẢI LẦN ĐẦU */}
            {loadingHistory && messages.length === 0 && (
              <div className="space-y-3 py-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`flex gap-2 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    {i % 2 === 0 && <div className="w-7 h-7 rounded-full bg-slate-200" />}
                    <div className="h-9 w-44 bg-slate-200 rounded-2xl" />
                  </div>
                ))}
              </div>
            )}

            {/* DANH SÁCH TIN NHẮN */}
            {messages.map((msg, index) => {
              const isMe = user?.id && Number(msg.userId) === Number(user.id);
              const showAvatar =
                !isMe && (index === 0 || messages[index - 1].userId !== msg.userId);

              return (
                <div
                  key={`${msg.id}-${index}`}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {/* Tên người gửi nếu là tin nhắn của người khác */}
                  {!isMe && showAvatar && (
                    <span className="text-[11px] font-bold text-slate-500 ml-9 mb-1">
                      {msg.username}
                    </span>
                  )}

                  <div className={`flex items-end gap-1.5 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar người khác */}
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                        {msg.avatarUrl ? (
                          <img
                            src={msg.avatarUrl}
                            alt={msg.username}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          (msg.username || 'U')[0].toUpperCase()
                        )}
                      </div>
                    )}

                    {/* Bong bóng tin nhắn */}
                    <div
                      className={`px-3.5 py-2 text-sm leading-relaxed break-words shadow-2xs ${
                        isMe
                          ? 'bg-sky-600 text-white rounded-2xl rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  {/* Thời gian gửi */}
                  <span
                    className={`text-[10px] text-slate-400 mt-1 font-medium ${
                      isMe ? 'mr-1' : 'ml-9'
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {typingUsers.length > 0 && (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 italic py-1">
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span>{typingUsers.join(', ')} đang soạn tin...</span>
              </div>
            )}
          </div>

          {/* BANNER THÔNG BÁO LỖI / RATE LIMIT NẾU CÓ */}
          {errorMessage && (
            <div className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 border-t border-rose-100 flex items-center gap-1.5 animate-shake">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              {errorMessage}
            </div>
          )}

          {/* FOOTER: THANH NHẬP TIN NHẮN */}
          <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={isAuthenticated ? 'Nhắn gì đó với cộng đồng...' : 'Đăng nhập để chat...'}
              disabled={!isAuthenticated}
              maxLength={500}
              className="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm px-3.5 py-2.5 rounded-xl border border-transparent focus:border-sky-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || cooldown > 0 || !isAuthenticated}
              className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs active:scale-95 shrink-0"
              title={cooldown > 0 ? `Chờ ${cooldown}s` : 'Gửi tin nhắn'}
            >
              {cooldown > 0 ? (
                <span className="text-xs font-bold">{cooldown}s</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">send</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 2. NÚT BONG BÓNG CHAT THU NHỎ (GÓC DƯỚI BÊN PHẢI) */}
      <button
        onClick={handleToggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 cursor-pointer active:scale-90 group relative ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800 rotate-90'
            : 'bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 hover:shadow-sky-500/40 hover:scale-105'
        }`}
        title="Chat cộng đồng ENjoy"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-[24px]">close</span>
        ) : (
          <>
            <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">
              chat_bubble
            </span>

            {/* HUY HIỆU TIN NHẮN CHƯA ĐỌC */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 bg-rose-500 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};
