import { AppError, DatabaseError } from "@/error";

export { AppError, DatabaseError };

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
 * 当前密码错误
 */
export class WrongPasswordError extends AppError {
  constructor() {
    super("当前密码错误", "WRONG_PASSWORD", 401);
    this.name = "WrongPasswordError";
  }
}
