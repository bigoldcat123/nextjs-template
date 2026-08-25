export type ActionStateStauts = {
  ok: "";
  error: "";
};

export type ActionState =
  | {
      status: keyof ActionStateStauts;
      message: string;
    }
  | undefined;
/**
 * 权限(来自 permissions 表,客户端与服务端共用)
 */
export type Permission = {
  id: string;
  resource: string;
  action: string;
  description: string | null;
};
