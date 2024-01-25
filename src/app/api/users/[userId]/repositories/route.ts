import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const provider = request.nextUrl.searchParams.get("provider") ?? "default";

  return NextResponse.json({}, {status: 200});
}