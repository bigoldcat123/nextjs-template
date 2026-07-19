"use server";

import { revalidatePath } from "next/cache";
import { userService } from "@/features/user/user-service";

export async function createUser(
  preState: { error?: string },
  formData: FormData,
) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string | undefined;
  const displayName = formData.get("displayName") as string | undefined;
  const password = formData.get("password") as string;
  await userService.create({
    username,
    email: email || undefined,
    displayName: displayName || undefined,
    password,
  });

  revalidatePath("/dashboard/users");
}

export async function updateUser(id: string, formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string | undefined;
  const displayName = formData.get("displayName") as string | undefined;
  const password = formData.get("password") as string;

  const data: Parameters<typeof userService.update>[1] = {
    username,
    email: email || undefined,
    displayName: displayName || undefined,
  };

  if (password) {
    data.password = password;
  }

  await userService.update(id, data);
  revalidatePath("/dashboard/users");
}

export async function deleteUser(id: string) {
  await userService.delete(id);
  revalidatePath("/dashboard/users");
}
