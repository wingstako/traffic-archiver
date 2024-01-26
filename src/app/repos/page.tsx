import { Repository } from "@prisma/client";
import { redirect } from "next/navigation";
import RepoTable from "~/components/repo";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

// async function getRepos() {
//   const session = await getServerAuthSession();
//   const user = await db.user.findUnique({
//     where: {
//       email: session?.user.email ?? undefined,
//     },
//     include: {
//       accounts: true,
//     }
//   });

//   const response = await fetch("https://api.github.com/user/repos", {
//     headers: {
//       Authorization: `token ${user?.accounts[0]?.access_token}`,
//     },
//   });
//   const repos: Repo[] = await response.json() as Repo[];
//   return repos;
// }

async function getRepositories(userId: string) {
  const response = await fetch(`http://localhost:3000/api/users/${userId}/repositories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data: ResponseRepository[] = await response.json() as ResponseRepository[];
  return data;
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

  if (session === null) {
    return redirect('/401');
  }

  const repos = await getRepositories(session.user?.id);
  const records = await getRecords(session.user?.id);

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
            <RepoTable repos={repos} userId={session.user?.id} records={records}></RepoTable>
          </tbody>
        </table>
      </div>
    </main>
  );
}

type UnlistenedRepository = {
  userId: string;
  githubId: number;
  name: string;
  fullName: string;
  private: boolean;
};

type ResponseRepository = Repository | UnlistenedRepository;