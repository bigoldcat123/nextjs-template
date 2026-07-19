/**
 * 用户模块自定义错误
 */

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
 * 用户不存在
 */
export class UserNotFoundError extends AppError {
  constructor(userId?: string) {
    const message = userId ? `用户不存在: ${userId}` : "用户不存在";
    super(message, "USER_NOT_FOUND", 404);
    this.name = "UserNotFoundError";
  }
}

/**
 * 用户名已存在
 */
export class UsernameAlreadyExistsError extends AppError {
  constructor(username: string) {
    super(`用户名已存在: ${username}`, "USERNAME_ALREADY_EXISTS", 409);
    this.name = "UsernameAlreadyExistsError";
  }
}

/**
 * 邮箱已存在
 */
export class EmailAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`邮箱已存在: ${email}`, "EMAIL_ALREADY_EXISTS", 409);
    this.name = "EmailAlreadyExistsError";
  }
}

/**
 * 无效的用户输入
 */
export class InvalidUserInputError extends AppError {
  constructor(field: string, reason?: string) {
    const message = reason
      ? `无效的 ${field}: ${reason}`
      : `无效的 ${field}`;
    super(message, "INVALID_USER_INPUT", 400);
    this.name = "InvalidUserInputError";
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
