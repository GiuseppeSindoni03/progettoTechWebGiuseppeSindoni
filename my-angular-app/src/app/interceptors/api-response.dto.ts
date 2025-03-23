export interface APIResponse<T> {
    status: "success" | "error";
    data: T;
    message: string;
  }
  