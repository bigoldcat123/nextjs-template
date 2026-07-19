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
