import type { User } from '@prisma/client'
import { NextResponse } from 'next/server'
import { db } from '~/server/db'

type DetailedStat = {
  timestamp: string
  count: number
  uniques: number
}

type ViewResponse = {
  count: number
  uniques: number
  views: DetailedStat[]
}

type CloneResponse = {
  count: number
  uniques: number
  clones: DetailedStat[]
}

type Response = {
  updatedRepositories: { owner: string, repo: string }[];
  total: number;
} | {
  error: string;
}

export async function GET(_request: Request) {

  try {
    const response: Response = {
      updatedRepositories: [],
      total: 0
    };

    await db.repository.update({
      where: {
        id: 1,
      },
      data: {
        name: 'wingstako-neocities',
      }
    })

    const repositories = await db.repository.findMany({
      include: {
        user: {
          include: {
            accounts: true,
          }
        },
        repositoryClones: true,
        repositoryViews: true,
      }
    });

    for (const repository of repositories) {

      const owner = (repository.user as User)?.name ?? '';
      const repo = repository.name;

      const githubAccessToken = repository.user?.accounts[0]?.access_token ?? null;

      const githubViewsAPI = `https://api.github.com/repos/${owner}/${repo}/traffic/views`;
      const githubClonesAPI = `https://api.github.com/repos/${owner}/${repo}/traffic/clones`;

      // fetch views
      const viewsResponse = await fetch(githubViewsAPI, {
        headers: {
          Authorization: `token ${githubAccessToken}`
        }
      });

      const viewsData: ViewResponse = await viewsResponse.json() as ViewResponse;
      await db.repositoryViews.createMany({
        data: viewsData.views.map((view) => {
          return {
            timestamp: view.timestamp,
            count: view.count,
            uniques: view.uniques,
            repositoryId: repository.id,
          }
        })
      });

      // fetch clones
      const clonesResponse = await fetch(githubClonesAPI, {
        headers: {
          Authorization: `token ${githubAccessToken}`
        }
      });

      const clonesData: CloneResponse = await clonesResponse.json() as CloneResponse;
      await db.repositoryClones.createMany({
        data: clonesData.clones.map((clone) => {
          return {
            timestamp: clone.timestamp,
            count: clone.count,
            uniques: clone.uniques,
            repositoryId: repository.id,
          }
        })
      });

      response.updatedRepositories.push({ owner, repo });
      response.total++;
    }

    return NextResponse.json({ message: response }, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}