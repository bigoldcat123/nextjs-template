"use server";

import { revalidatePath, updateTag } from "next/cache";
import { roleService } from "@/features/role/role-service";
import { z } from "zod";
import { AppError } from "./role-errors";
import type { ActionState } from "@/types";

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
