/**
 * 基础应用错误
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * 数据库操作错误
 */
export class DatabaseError extends AppError {
  constructor(operation: string, originalError?: unknown) {
    const message = `数据库${operation}失败`;
    super(message, "DATABASE_ERROR", 500);
    this.name = "DatabaseError";
    if (originalError) {
      this.cause = originalError;
    }
  }
}
