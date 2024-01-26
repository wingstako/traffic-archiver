'use client'

import { Repository } from "@prisma/client";
import Link from "next/link";

type UnlistenedRepository = {
  userId: string;
  githubId: number;
  name: string;
  fullName: string;
  private: boolean;
};

type ResponseRepository = Repository | UnlistenedRepository;

async function listenRepo(repo: ResponseRepository, userId: string) {
  return await fetch(`http://localhost:3000/api/users/${userId}/repositories`, {
    method: "POST",
    body: JSON.stringify({
      repo: repo,
      userId: userId
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const RepoTable = (data: { repos: ResponseRepository[], records: Repository[], userId: string }) => {
  const repos = data.repos;
  const records = data.records;
  console.log(repos);
  const rows = repos.map((repo, index) => {
    return (
      <tr key={index}>
        <th>{index + 1}</th>
        <td>
          <Link href={'https://github.com/' + repo.fullName} className="link">{repo.fullName}</Link>
        </td>
        <td>
          <button className="btn btn-primary btn-sm" onClick={() => listenRepo(repo, data.userId)}>Listen</button>

        </td>
      </tr>
    );
  });

  return rows;
};

export default RepoTable;
