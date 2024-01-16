import type { Repository, RepositoryClones, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

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

    const owner = (repository.user as User)?.name ?? null;
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
      data: viewsData.views.map(view => ({
        timestamp: view.timestamp,
        count: view.count,
        uniques: view.uniques,
        repositoryId: repository.id,
      }))
    });
    

    console.log(await viewsResponse.json());
  }

  res.status(200).json({ message: JSON.stringify(repositories) })
}