import { AppError, DatabaseError } from "@/error";

export { AppError, DatabaseError };

/**
 * 无效的角色输入
 */
export class InvalidRoleInputError extends AppError {
  constructor(field: string, reason?: string) {
    const message = reason
      ? `无效的 ${field}: ${reason}`
      : `无效的 ${field}`;
    super(message, "INVALID_ROLE_INPUT", 400);
    this.name = "InvalidRoleInputError";
  }
}
