"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: { error?: string; callbackUrl?: string } | undefined,
  formData: FormData,
) {
  try {
    await new Promise((e) => {
      setTimeout(() => {
        e(0);
      }, 1000);
    });
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: prevState?.callbackUrl || "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "邮箱或密码不正确" };
        default:
          return { error: "登录时发生未知错误" };
      }
    }
    // 关键:AuthError 之外的错误(比如内部重定向用的特殊错误)必须重新 throw
    // 否则 signIn 成功后的跳转会被你的 catch 吞掉,导致登录成功却不跳转
    throw error;
  }
  return prevState;
}
