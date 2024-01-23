import { redirect } from "next/navigation";
import RepoTable from "~/components/repo";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

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

async function getRepos() {
  const session = await getServerAuthSession();
  const user = await db.user.findUnique({
    where: {
      email: session?.user.email ?? undefined,
    },
    include: {
      accounts: true,
    }
  });

  const response = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${user?.accounts[0]?.access_token}`,
    },
  });
  const repos: Repo[] = await response.json() as Repo[];
  return repos;
}

async function getRecords(userId: string) {
  const records = await db.repository.findMany({
    where: {
      userId: userId
    }
  });
  return records;
}

export default async function ReposPage() {

  const session = await getServerAuthSession();

  if (session?.user === null) {
    return redirect('/');
  }

  const repos = await getRepos();
  const records = await getRecords(session!.user?.id);

  return (
    <main className="">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <RepoTable repos={repos} userId={session!.user?.id} records={records}></RepoTable>
          </tbody>
        </table>
      </div>
    </main>
  );
}