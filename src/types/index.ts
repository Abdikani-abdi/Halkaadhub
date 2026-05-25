// ===== Enums (as string literal unions for erasableSyntaxOnly) =====
export type ItemStatus = 'Active' | 'Found' | 'Recovered' | 'Closed';
export const ITEM_STATUS = { Active: 'Active', Found: 'Found', Recovered: 'Recovered', Closed: 'Closed' } as const;

export type MatchStatus = 'Pending' | 'Accepted' | 'Rejected';
export const MATCH_STATUS = { Pending: 'Pending', Accepted: 'Accepted', Rejected: 'Rejected' } as const;

export type UserRole = 'User' | 'Manager' | 'Admin';
export const USER_ROLE = { User: 'User', Manager: 'Manager', Admin: 'Admin' } as const;

export type NotificationType = 'MatchFound' | 'MatchAccepted' | 'NewMessage' | 'ItemRecovered' | 'ReportUpdate' | 'System';

export type ReportStatus = 'Pending' | 'Reviewed' | 'Resolved' | 'Dismissed';
export const REPORT_STATUS = { Pending: 'Pending', Reviewed: 'Reviewed', Resolved: 'Resolved', Dismissed: 'Dismissed' } as const;

export type MessageType = 'Text' | 'Image' | 'System';

// ===== API Response =====
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PagedResponse<T> {
  success: boolean;
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// ===== Auth =====
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  city?: string;
  district?: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserMinimalDto;
}

export interface UserMinimalDto {
  id: string;
  fullName: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  role: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

// ===== User =====
export interface UserProfileDto {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  bio?: string;
  city?: string;
  district?: string;
  role: string;
  reputationScore: number;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  city?: string;
  district?: string;
}

// ===== Lost Item =====
export interface LostItemDto {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  color?: string;
  brand?: string;
  locationLost?: string;
  latitude?: number;
  longitude?: number;
  lostDate?: string;
  rewardAmount?: number;
  status: string;
  imageUrls: string[];
  createdAt: string;
}

export interface CreateLostItemDto {
  title: string;
  description: string;
  categoryId: string;
  color?: string;
  brand?: string;
  locationLost?: string;
  latitude?: number;
  longitude?: number;
  lostDate?: string;
  rewardAmount?: number;
}

export interface UpdateLostItemDto {
  title?: string;
  description?: string;
  categoryId?: string;
  color?: string;
  brand?: string;
  locationLost?: string;
  latitude?: number;
  longitude?: number;
  lostDate?: string;
  rewardAmount?: number;
}

export interface LostItemSearchParams {
  query?: string;
  categoryId?: string;
  city?: string;
  color?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ===== Found Item =====
export interface FoundItemDto {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  color?: string;
  brand?: string;
  locationFound?: string;
  latitude?: number;
  longitude?: number;
  foundDate?: string;
  currentStorageLocation?: string;
  status: string;
  imageUrls: string[];
  createdAt: string;
}

export interface CreateFoundItemDto {
  title: string;
  description: string;
  categoryId: string;
  color?: string;
  brand?: string;
  locationFound?: string;
  latitude?: number;
  longitude?: number;
  foundDate?: string;
  currentStorageLocation?: string;
}

export interface UpdateFoundItemDto {
  title?: string;
  description?: string;
  categoryId?: string;
  color?: string;
  brand?: string;
  locationFound?: string;
  latitude?: number;
  longitude?: number;
  foundDate?: string;
  currentStorageLocation?: string;
}

export interface FoundItemSearchParams {
  query?: string;
  categoryId?: string;
  city?: string;
  color?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ===== Match =====
export interface MatchDto {
  id: string;
  lostItemId: string;
  lostItemTitle: string;
  foundItemId: string;
  foundItemTitle: string;
  matchScore: number;
  matchReason?: string;
  status: string;
  createdAt: string;
}

export interface MatchSuggestionDto {
  foundItemId: string;
  foundItemTitle: string;
  foundItemDescription?: string;
  imageUrls: string[];
  matchScore: number;
  matchReason: string;
}

// ===== Chat =====
export interface ChatDto {
  id: string;
  lostItemOwnerId: string;
  lostItemOwnerName: string;
  foundItemOwnerId: string;
  foundItemOwnerName: string;
  matchId: string;
  lastMessage?: MessageDto;
  unreadCount: number;
  createdAt: string;
}

export interface MessageDto {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  messageText: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageDto {
  messageText: string;
  messageType?: string;
}

// ===== Notification =====
export interface NotificationDto {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

// ===== Report =====
export interface ReportDto {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reason: string;
  status: string;
  createdAt: string;
}

export interface CreateReportDto {
  reportedUserId?: string;
  reason: string;
}

// ===== Admin =====
export interface DashboardDto {
  totalUsers: number;
  totalLostItems: number;
  totalFoundItems: number;
  totalMatches: number;
  totalRecoveredItems: number;
  pendingReports: number;
  activeUsersToday: number;
  recentActivities: RecentActivityDto[];
}

export interface RecentActivityDto {
  action: string;
  userName: string;
  timestamp: string;
}

export interface AdminUserDto {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
  reputationScore: number;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  icon?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  icon?: string;
}
