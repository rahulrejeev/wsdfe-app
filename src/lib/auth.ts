import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "wsdfe_admin_session";

export function getAdminToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }
  return password;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === getAdminToken();
}
