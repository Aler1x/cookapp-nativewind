export type ErrorResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export type SuccessResponse<T> = {
  success: boolean;
  data: T;
};

export type PaginatedResponse<T> = {
  success?: boolean;
  data: T[];
  meta: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
};

export type SearchProduct = {
  id: string;
  name: string;
};
