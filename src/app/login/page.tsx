import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <>
      <form
        action={async (formdata) => {
          "use server";
          await signIn("credentials", formdata,);
        }}
      >
        <label htmlFor="username">
          username: <input id="username" name="username" />
        </label>
        <label htmlFor="password">
          username: <input id="password" name="password" />
        </label>
        <button type="submit">login</button>
      </form>
    </>
  );
}
