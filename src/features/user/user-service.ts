import "server-only";

import {
  userRepository,
  type CreateUserInput,
  type UpdateUserInput,
} from "./use-repository";
import {
  DatabaseError,
  EmailAlreadyExistsError,
  InvalidUserInputError,
  UserNotFoundError,
  UsernameAlreadyExistsError,
} from "./user-errors";

/**
 * 用户服务层 - 处理业务逻辑和异常转换
 * 将 repository 层的外部错误转换为内部自定义错误
 */
export const userService = {
  /**
   * 创建新用户
   */
  async create(input: CreateUserInput) {
    // 输入验证
    if (!input.username?.trim()) {
      throw new InvalidUserInputError("username", "不能为空");
    }
    if (!input.password?.trim()) {
      throw new InvalidUserInputError("password", "不能为空");
    }

    try {
      return await userRepository.create(input);
    } catch (error) {
      // 捕获数据库唯一约束错误
      if (isUniqueConstraintError(error, "username")) {
        throw new UsernameAlreadyExistsError(input.username);
      }
      if (isUniqueConstraintError(error, "email")) {
        throw new EmailAlreadyExistsError(input.email ?? "");
      }
      throw new DatabaseError("创建用户", error);
    }
  },

  /**
   * 根据 ID 查找用户
   */
  async findById(id: string) {
    try {
      return await userRepository.findById(id);
    } catch (error) {
      throw new DatabaseError("查询用户", error);
    }
  },

  /**
   * 根据 ID 查找用户，不存在则抛出异常
   */
  async findByIdOrThrow(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  },

  /**
   * 根据用户名查找用户
   */
  async findByUsername(username: string) {
    try {
      return await userRepository.findByUsername(username);
    } catch (error) {
      throw new DatabaseError("查询用户", error);
    }
  },

  /**
   * 根据用户名查找用户，不存在则抛出异常
   */
  async findByUsernameOrThrow(username: string) {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new UserNotFoundError(username);
    }
    return user;
  },

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string) {
    try {
      return await userRepository.findByEmail(email);
    } catch (error) {
      throw new DatabaseError("查询用户", error);
    }
  },

  /**
   * 查询所有用户
   */
  async findAll() {
    try {
      return await userRepository.findAll();
    } catch (error) {
      throw new DatabaseError("查询用户列表", error);
    }
  },

  /**
   * 分页查询用户
   */
  async findPaginated(page: number = 1, pageSize: number = 10) {
    if (page < 1) {
      throw new InvalidUserInputError("page", "必须大于 0");
    }
    if (pageSize < 1 || pageSize > 100) {
      throw new InvalidUserInputError("pageSize", "必须在 1-100 之间");
    }

    try {
      return await userRepository.findPaginated(page, pageSize);
    } catch (error) {
      throw new DatabaseError("分页查询用户", error);
    }
  },

  /**
   * 更新用户
   */
  async update(id: string, input: UpdateUserInput) {
    // 先检查用户是否存在
    const existingUser = await this.findByIdOrThrow(id);

    try {
      const user = await userRepository.update(id, input);
      if (!user) {
        throw new UserNotFoundError(id);
      }
      return user;
    } catch (error) {
      // 如果是自定义错误，直接抛出
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      // 捕获唯一约束错误
      if (isUniqueConstraintError(error, "username")) {
        throw new UsernameAlreadyExistsError(existingUser.username);
      }
      if (isUniqueConstraintError(error, "email")) {
        throw new EmailAlreadyExistsError(input.email ?? existingUser.email ?? "");
      }
      throw new DatabaseError("更新用户", error);
    }
  },

  /**
   * 删除用户
   */
  async delete(id: string) {
    // 先检查用户是否存在
    await this.findByIdOrThrow(id);

    try {
      const user = await userRepository.delete(id);
      if (!user) {
        throw new UserNotFoundError(id);
      }
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError("删除用户", error);
    }
  },
};

/**
 * 判断是否为唯一约束错误
 */
function isUniqueConstraintError(error: unknown, field: string): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("unique") &&
      (message.includes(field) || message.includes("duplicate"))
    );
  }
  return false;
}
