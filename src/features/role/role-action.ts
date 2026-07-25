"use server";

import { revalidatePath, updateTag } from "next/cache";
import { roleService } from "@/features/role/role-service";
import { z } from "zod";
import { AppError } from "./role-errors";
import type { ActionState } from "@/types";
import { db } from "@/db";
import { roleHierarchy } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const createRoleSchema = z.object({
  name: z.string().min(1, "角色名称不能为空").max(100, "角色名称不能超过100个字符"),
  description: z.string().optional(),
});

export async function createRoleAction(
  preState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = createRoleSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  try {
    await roleService.create(result.data);
  } catch (e) {
    if (e instanceof AppError) {
      return { status: "error", message: e.message };
    } else {
      return { status: "error", message: "unknown Error!" };
    }
  }

  updateTag("roles");
  revalidatePath("/dashboard/role");
  return { status: "ok", message: "创建成功" };
}

const addParentRoleSchema = z.object({
  childRoleId: z.string().min(1),
  parentRoleId: z.string().min(1, "请选择父角色"),
});

export async function addParentRoleAction(
  preState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = addParentRoleSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return { status: "error", message: result.error.issues[0].message };
  }

  const { childRoleId, parentRoleId } = result.data;

  if (childRoleId === parentRoleId) {
    return { status: "error", message: "不能将角色设为自己的父角色" };
  }

  try {
    // 检查是否已存在该继承关系
    const existing = await db.query.roleHierarchy.findFirst({
      where: {
        parentRoleId,
        childRoleId,
      },
    });

    if (existing) {
      return { status: "error", message: "该继承关系已存在" };
    }

    await db.insert(roleHierarchy).values({
      parentRoleId,
      childRoleId,
    });
  } catch (e) {
    if (e instanceof AppError) {
      return { status: "error", message: e.message };
    }
    return { status: "error", message: "添加父角色失败" };
  }

  updateTag("roles");
  revalidatePath(`/dashboard/role/${childRoleId}`);
  return { status: "ok", message: "添加成功" };
}

export async function removeParentRoleAction(
  childRoleId: string,
  parentRoleId: string,
): Promise<ActionState> {
  try {
    await db
      .delete(roleHierarchy)
      .where(
        and(
          eq(roleHierarchy.parentRoleId, parentRoleId),
          eq(roleHierarchy.childRoleId, childRoleId),
        ),
      );
  } catch (e) {
    return { status: "error", message: "取消继承失败" };
  }

  updateTag("roles");
  revalidatePath(`/dashboard/role/${childRoleId}`);
  return { status: "ok", message: "已取消继承" };
}
