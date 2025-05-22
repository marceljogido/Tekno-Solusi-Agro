import { getUserFromSession } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromSession();
  if (!user) {
    return Response.json({}, { status: 401 });
  }

  return Response.json(user);
}
