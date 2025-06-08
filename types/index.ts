export type ErrorResponse = {
  success: false;
  message?: string;
  error?: string;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type PaginatedResponse<T> = {
  success: true;
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
