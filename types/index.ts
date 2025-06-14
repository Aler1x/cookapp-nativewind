export type Response<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = {
  success?: boolean; // spring doesn't send this
  data?: T[];
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
