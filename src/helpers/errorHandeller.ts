import { NextResponse } from "next/server";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Centralized API error handler
 * @param error - The error object caught in catch block
 * @param prodMsg - Safe error message to return in production
 * @param context - Optional string to indicate where the error occurred and it will be printed in console
 */
export const  handleApiError = (
    error: unknown,
    prodMsg: string,
    context?: string
  ) => {
    let errorMessage: string;
    let statusCode = 500;
  
    if (process.env.NODE_ENV === "development") {
      console.error(`${context}  -->`, error);
    }
  
    if (error instanceof AppError) {
      errorMessage = error.message;
      statusCode = error.statusCode;
    } else if (error instanceof Error ) {
      errorMessage = error.message;
    } else {
      errorMessage = prodMsg;
    }
  
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
  
