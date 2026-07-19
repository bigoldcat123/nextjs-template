"use server";

import { revalidatePath } from "next/cache";
import { userService } from "@/features/user/user-service";
import { z } from "zod";
import { AppError } from "./user-errors";
import { updateTag } from "next/cache";

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

export async function createUserAction(
  preState: { error?: string },
  formData: FormData,
) {
  const result = createUserSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  try {
    await userService.create(result.data);
  } catch (e) {
    if (e instanceof AppError) {
      return { error: e.message };
    } else {
      return { error: "unknow Error!" };
    }
  }
  updateTag("users");
  revalidatePath("/dashboard/users");
  return { error: undefined };
}

export async function updateUser(
  preState: { error?: string },
  formData: FormData,
) {
  const result = updateUserSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }


  try {
    await userService.update(result.data);
  } catch (e) {
    if (e instanceof AppError) {
      return { error: e.message };
    } else {
      return { error: "unknow Error!" };
    }
  }
  updateTag("users");
  revalidatePath("/dashboard/users");
  return { error: undefined };
}

export async function deleteUser(id: string) {
  try {
    await userService.delete(id);
  } catch (e) {
    if (e instanceof AppError) {
      return { error: e.message };
    } else {
      return { error: "unknow Error!" };
    }
  }
  updateTag("users");
  revalidatePath("/dashboard/users");
  return { error: undefined };
}
