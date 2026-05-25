import client from './client';
import type { ApiResponse, MatchDto, MatchSuggestionDto } from '@/types';

export const matchesApi = {
  getSuggestions: (lostItemId: string) =>
    client.get<ApiResponse<MatchSuggestionDto[]>>(`/matches/suggestions/${lostItemId}`).then((r) => r.data),

  accept: (id: string) =>
    client.post<ApiResponse<MatchDto>>(`/matches/${id}/accept`).then((r) => r.data),

  reject: (id: string) =>
    client.post<ApiResponse<boolean>>(`/matches/${id}/reject`).then((r) => r.data),
};
