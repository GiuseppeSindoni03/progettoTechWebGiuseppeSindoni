import { Request } from "express";

export enum Status {
    ERROR = "error",
    SUCCESS = "success",
  }
  
  export class APIResponse<T = any> {
    status: Status;
    data: T;
    message?: string;
  
    constructor(status: Status, data: T, message?: string) {
      this.status = status;
      this.data = data;
      this.message = message;
    }
  }

export interface AuthRequest extends Request {
  user?: {
    id: string; 
    email: string;
    username: string;
  };
}

export type SearchType = "mainstream" | "unpopular" | "newest" | "controverse";