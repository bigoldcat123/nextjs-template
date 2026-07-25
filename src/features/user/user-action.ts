"use server";

import { revalidatePath, updateTag } from "next/cache";
import { userService } from "@/features/user/user-service";
import { z } from "zod";
import { AppError } from "./user-errors";
import type { ActionState } from "@/types";
import { sleep } from "@/lib/utils";
import { auth } from "@/auth";

const createUserSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  email: z.email("邮箱格式不正确").optional().or(z.literal("")),
  displayName: z.string().optional(),
  password: z.string().min(1, "密码不能为空"),
});

const updateUserSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  email: z.email("邮箱格式不正确").optional().or(z.literal("")),
  displayName: z.string().optional(),
  password: z.string().optional(),
  id: z.string("ID 不可为空"),
});

/**
 * 从 FormData 中提取选中的角色 ID 列表（多选框 name="roleIds"）
 */
function parseRoleIds(formData: FormData): string[] {
  return formData
    .getAll("roleIds")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

export async function createUserAction(preState: ActionState, formData: FormData): Promise<ActionState> {

  const result = createUserSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  await sleep(1000)

  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  try {
    const user = await userService.create(result.data);
    await userService.assignRoles(user.id, parseRoleIds(formData));
  } catch (e) {
    if (e instanceof AppError) {
      console.error(e)
      return { status: "error", message: e.message };
    } else {
      console.error(e)
      return { status: "error", message: "unknow Error!" };
    }
  }
  updateTag("users");
  revalidatePath("/dashboard/users");
  return { status: "ok", message: "创建成功" };
}

export async function updateUserAction(preState: ActionState, formData: FormData): Promise<ActionState> {
  const result = updateUserSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  await sleep(1000)
  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  const d = result.data;

  try {
    await userService.update(d);
    await userService.assignRoles(d.id, parseRoleIds(formData));
  } catch (e) {
    if (e instanceof AppError) {
      return { status: "error", message: e.message };
    } else {
      return { status: "error", message: "unknow Error!" };
    }
  }
  updateTag("users");
  revalidatePath("/dashboard/users");
  return { status: "ok", message: "更新成功" };
}

export async function deleteUserAction(id:string): Promise<ActionState> {

  try {
    await userService.delete(id);
  } catch (e) {
    if (e instanceof AppError) {
      return { status: "error", message: e.message };
    } else {
      return { status: "error", message: "unknow Error!" };
    }
  }
  updateTag("users");
  revalidatePath("/dashboard/users");
  return { status: "ok", message: "删除成功" };
}

// ── 个人信息修改 ──

const updateProfileSchema = z.object({
  displayName: z.string().min(1, "显示名不能为空"),
  email: z.email("邮箱格式不正确").optional().or(z.literal("")),
});

export async function updateProfileAction(
  preState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { status: "error", message: "未登录" };
  }

  const result = updateProfileSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  try {
    await userService.update({
      id: userId,
      displayName: result.data.displayName,
      email: result.data.email || undefined,
    });
  } catch (e) {
    if (e instanceof AppError) {
      return { status: "error", message: e.message };
    }
    return { status: "error", message: "更新失败" };
  }

  updateTag("users");
  return { status: "ok", message: "修改成功" };
}

// ── 修改密码 ──

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "请输入当前密码"),
  newPassword: z.string().min(6, "新密码至少6位"),
  confirmPassword: z.string().min(1, "请确认新密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的密码不一致",
  path: ["confirmPassword"],
});

export async function changePasswordAction(
  preState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { status: "error", message: "未登录" };
  }

  const result = changePasswordSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  try {
    await userService.changePassword(
      userId,
      result.data.currentPassword,
      result.data.newPassword,
    );
  } catch (e) {
    if (e instanceof AppError) {
      return { status: "error", message: e.message };
    }
    return { status: "error", message: "修改密码失败" };
  }

  return { status: "ok", message: "密码修改成功" };
}
