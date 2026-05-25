import client from './client';
import type { ApiResponse, PagedResponse, ChatDto, MessageDto, SendMessageDto } from '@/types';

export const chatsApi = {
  getMyChats: () =>
    client.get<ApiResponse<ChatDto[]>>('/chats').then((r) => r.data),

  getMessages: (chatId: string, page = 1, pageSize = 50) =>
    client.get<PagedResponse<MessageDto>>(`/chats/${chatId}/messages`, { params: { page, pageSize } }).then((r) => r.data),

  sendMessage: (chatId: string, dto: SendMessageDto) =>
    client.post<ApiResponse<MessageDto>>(`/chats/${chatId}/messages`, dto).then((r) => r.data),
};
