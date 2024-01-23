'use client'

import { Repository } from "@prisma/client";
import Link from "next/link";

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
	await fetch("/api/repo", {
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

const RepoTable = (data: { repos: Repo[], records: Repository[], userId: string }) => {
	const repos = data.repos;
	const records = data.records;
	const rows = repos.map((repo, index) => {
		return (
			<tr key={index}>
				<th>{index + 1}</th>
				<td>
					<Link href={'https://github.com/' + repo.full_name} className="link">{repo.full_name}</Link> <> </>
					<div className="badge badge-outline badge-sm"> stars: {repo.stargazers_count}
					</div>
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
