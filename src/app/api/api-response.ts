export type ApiResponse<T> = {
  status: 'success' | 'error';
  data?: T | null;
  error?: {
    message: string;
    code?: string;
  };
};