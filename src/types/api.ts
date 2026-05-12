/* ─────────────────────────────────────────────
   Base Api response types
──────────────────────────────────────────── */

export interface IApiResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface IApiErrorResponse {
  success: false;
  message: string;
  errors?: IFieldError[];
}

export interface IFieldError {
  field: string;
  message: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
}
