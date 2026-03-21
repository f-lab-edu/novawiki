export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  errorCode?: string;
  message?: string;
};

export type GoogleOAuthData = {
  url: string;
  provider: string;
};
