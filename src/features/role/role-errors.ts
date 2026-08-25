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

/**
 * 角色名称已存在
 */
export class RoleNameAlreadyExistsError extends AppError {
  constructor(name: string) {
    super(`角色 "${name}" 已存在`, "ROLE_NAME_ALREADY_EXISTS", 409);
    this.name = "RoleNameAlreadyExistsError";
  }
}
/**
 * 角色不存在
 */
export class RoleNotFoundError extends AppError {
  constructor(roleId?: string) {
    const message = roleId ? `角色不存在: ${roleId}` : "角色不存在";
    super(message, "ROLE_NOT_FOUND", 404);
    this.name = "RoleNotFoundError";
  }
}
