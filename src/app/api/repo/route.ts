import { NextResponse } from 'next/server'
import { db } from '~/server/db'

type Repo = {
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

async function listenRepo(repo: Repo, userId: string) {
  return await db.repository.create({
    data: {
      userId: userId,
      github_id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      private: repo.private,
    }
  });
}

export async function POST(request: Request) {
  const data: { repo: Repo, userId: string } = await request.json() as { repo: Repo, userId: string };
  const repo = data.repo;
  const userId = data.userId;
  return NextResponse.json(await listenRepo(repo, userId));
}