import { useEffect, useState, useRef } from 'react';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { chatsApi } from '@/api/chats';
import { useAuthStore } from '@/stores/authStore';
import { useSignalR } from '@/hooks/useSignalR';
import type { ChatDto, MessageDto } from '@/types';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';

export default function ChatsPage() {
  const user = useAuthStore((s) => s.user);
  const { on, invoke } = useSignalR('chat');
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ChatDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<ChatDto | null>(null);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    (async () => {
      try {
        const res = await chatsApi.getMyChats();
        setChats(res.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  // Listen for real-time messages
  useEffect(() => {
    const off = on('ReceiveMessage', (data: unknown) => {
      const msg = data as { ChatId: string; SenderId: string; SenderName: string; MessageText: string; SentAt: string };
      if (activeChatRef.current && msg.ChatId === activeChatRef.current.id) {
        const newMsg: MessageDto = {
          id: crypto.randomUUID(),
          chatId: msg.ChatId,
          senderId: msg.SenderId,
          senderName: msg.SenderName,
          messageText: msg.MessageText,
          messageType: 'Text',
          isRead: false,
          createdAt: msg.SentAt || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    });
    return off;
  }, [on]);

  const openChat = async (chat: ChatDto) => {
    // Leave previous chat room
    if (activeChat) {
      invoke('LeaveChat', activeChat.id);
    }
    setActiveChat(chat);
    setMsgLoading(true);
    // Join new chat room
    invoke('JoinChat', chat.id);
    try {
      const res = await chatsApi.getMessages(chat.id);
      setMessages(res.data || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch { toast.error('Failed to load messages'); }
    setMsgLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !activeChat) return;
    setSending(true);
    try {
      const res = await chatsApi.sendMessage(activeChat.id, { messageText: msgText });
      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data!]);
        setMsgText('');
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    } catch { toast.error('Failed to send'); }
    setSending(false);
  };

  const getOtherName = (chat: ChatDto) => {
    if (!user) return '';
    return user.id === chat.lostItemOwnerId ? chat.foundItemOwnerName : chat.lostItemOwnerName;
  };

  if (loading) return <Spinner text="Loading chats..." />;

  return (
    <div className="h-[calc(100vh-10rem)]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Messages</h1>

      <div className="flex h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Chat list */}
        <div className={`w-full sm:w-80 shrink-0 border-r border-gray-200 dark:border-gray-700 ${activeChat ? 'hidden sm:block' : ''}`}>
          {chats.length === 0 ? (
            <EmptyState title="No conversations" description="Start a conversation by matching items." icon={<MessageCircle className="h-12 w-12" />} />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 overflow-y-auto h-full">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => openChat(chat)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${activeChat?.id === chat.id ? 'bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{getOtherName(chat)}</span>
                    {chat.unreadCount > 0 && (
                      <span className="bg-emerald-600 text-white text-xs rounded-full px-2 py-0.5 ml-2">{chat.unreadCount}</span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{chat.lastMessage.messageText}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(chat.lastMessage?.createdAt || chat.createdAt), { addSuffix: true })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat window */}
        <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => setActiveChat(null)} className="sm:hidden text-gray-500 cursor-pointer">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{getOtherName(activeChat)}</h3>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgLoading ? (
                  <Spinner />
                ) : messages.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">No messages yet. Say hello!</p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                        }`}>
                          <p>{msg.messageText}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>
                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                  type="text"
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-gray-100"
                />
                <Button type="submit" loading={sending} className="rounded-full px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Select a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
