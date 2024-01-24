import { type Repository } from "@prisma/client";
import { NextResponse } from "next/server";
import { type ApiResponse } from "~/app/api/api-response";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string, repositoryId: number } }
) {

  let response: ApiResponse<Repository>;

  const session = await getServerAuthSession();
  if (!session || session.user.id !== params.userId) {
    response = {
      status: "error",
      error: {
        message: "Unauthorized",
      }
    };
    return NextResponse.json(response, { status: 401 });
  }

  try {
    const userId = params.userId;
    const repositoryId = Number(params.repositoryId);
    const repository = await db.repository.findUnique({
      where: {
        id: repositoryId,
        userId: userId,
      },
      include: {
        repositoryClones: true,
        repositoryViews: true,
      }
    });
    response = {
      data: repository,
      status: "success",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    response = {
      status: "error",
      error: {
        message: errorMessage,
      }
    }
  }

  return NextResponse.json(response, { status: response.status === "success" ? 200 : 500 });
}