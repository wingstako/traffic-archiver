import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const provider = request.nextUrl.searchParams.get("provider") ?? "default";

  if (provider === "github") {
    return await import("~/app/api/users/[userId]/repositories/github/route").then(
      (module) => module.GET(request, { params })
    );
  }
}