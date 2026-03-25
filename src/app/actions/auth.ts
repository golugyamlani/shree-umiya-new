"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=CredentialsSignin");
    }
    // Re-throw non-auth errors (e.g. NEXT_REDIRECT)
    throw error;
  }
  redirect("/admin/products");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
