import { type Repository } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { type ApiResponse } from "~/app/api/api-response";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {

  let response: ApiResponse<ResponseRepository[]>;

  const session = await getServerAuthSession();
  console.log(session)
  if (!session || session.user.id !== params.userId) {
    response = {
      status: "error",
      error: {
        message: "Unauthorized",
      }
    };
    return NextResponse.json(response, { status: 401 });
  }

  const userId = params.userId;

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      accounts: true,
      repositories: true,
    },
  });

  if (!user) {
    response = {
      status: "error",
      error: {
        message: "User not found",
      }
    };
    return NextResponse.json(response, { status: 404 });
  }

  const repositories = user.repositories;
  const githubRepositories: GitHubRepository[] = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${user?.accounts[0]?.access_token}`,
    },
  }).then(async response => await response.json() as GitHubRepository[]);

  const unlistenedRepositories: UnlistenedRepository[] = githubRepositories.filter(githubRepository => !repositories.some(repository => repository.github_id === githubRepository.id)).map(githubRepository => ({
    userId: userId,
    githubId: githubRepository.id,
    name: githubRepository.name,
    fullName: githubRepository.full_name,
    private: githubRepository.private,
  }));

  const responseRepositories: ResponseRepository[] = [...user.repositories, ...unlistenedRepositories];

  response = {
    data: responseRepositories,
    status: "success",
  };

  return NextResponse.json(response, { status: 200 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

  const data: { repository: UnlistenedRepository, userId: string } = await request.json() as { repository: UnlistenedRepository, userId: string };

  // create new repository in database by using data.repository
  const repository = data.repository;
  const userId = data.userId;
  const newRepository = await db.repository.create({
    data: {
      userId: userId,
      github_id: repository.githubId,
      name: repository.name,
      fullName: repository.fullName,
      private: repository.private,
    }
  });

  response = {
    data: newRepository,
    status: "success",
  };

  return NextResponse.json(response, { status: 200 });
}

type UnlistenedRepository = {
  userId: string;
  githubId: number;
  name: string;
  fullName: string;
  private: boolean;
};

type ResponseRepository = Repository | UnlistenedRepository;

type GitHubRepository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
  };
};