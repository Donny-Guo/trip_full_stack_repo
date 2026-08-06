import type { Request } from "express";

export interface CorrelatedRequest extends Request {
  requestId: string;
}
