/**
 * GitHub API client with fallback caching for Heet Patel's profile.
 */

export interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

const FALLBACK_PROFILE: GitHubProfile = {
  login: 'HeetPatel8126',
  name: 'Heet Patel',
  avatar_url: 'https://avatars.githubusercontent.com/u/104193581?v=4',
  bio: 'AI/ML Engineering · Discrete Diffusion · High-Throughput Data Systems',
  public_repos: 14,
  followers: 18,
  following: 12,
  html_url: 'https://github.com/HeetPatel8126',
};

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    name: 'SyntheticDataGen',
    description: 'Production-Grade Synthetic Data Generation Platform (FastAPI, Next.js, Celery, Redis)',
    html_url: 'https://github.com/HeetPatel8126',
    stargazers_count: 12,
    forks_count: 4,
    language: 'Python',
    updated_at: '2026-09-28',
  },
  {
    name: 'DiffusionLM',
    description: 'Discrete Diffusion Language Model Research (PyTorch from first principles)',
    html_url: 'https://github.com/HeetPatel8126',
    stargazers_count: 19,
    forks_count: 5,
    language: 'Python',
    updated_at: '2026-09-25',
  },
  {
    name: 'NIDRS',
    description: 'Real-time Network Intrusion Detection & Response System with Isolation Forests',
    html_url: 'https://github.com/HeetPatel8126',
    stargazers_count: 8,
    forks_count: 2,
    language: 'Python',
    updated_at: '2026-09-18',
  },
  {
    name: 'Veridian-DocIntel',
    description: 'Offline air-gapped document intelligence and summarization engine',
    html_url: 'https://github.com/HeetPatel8126',
    stargazers_count: 6,
    forks_count: 1,
    language: 'Python',
    updated_at: '2026-09-10',
  },
];

let cachedProfile: GitHubProfile | null = null;
let cachedRepos: GitHubRepo[] | null = null;
let lastFetchTime = 0;

export async function fetchGitHubData(): Promise<{
  profile: GitHubProfile;
  repos: GitHubRepo[];
}> {
  const now = Date.now();
  if (cachedProfile && cachedRepos && now - lastFetchTime < 1000 * 60 * 10) {
    return { profile: cachedProfile, repos: cachedRepos };
  }

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/HeetPatel8126'),
      fetch('https://api.github.com/users/HeetPatel8126/repos?sort=pushed&per_page=6'),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      throw new Error('GitHub API rate limit or error');
    }

    const profileData = (await profileRes.json()) as GitHubProfile;
    const reposData = (await reposRes.json()) as GitHubRepo[];

    cachedProfile = profileData;
    cachedRepos = reposData;
    lastFetchTime = now;

    return { profile: profileData, repos: reposData };
  } catch {
    return { profile: FALLBACK_PROFILE, repos: FALLBACK_REPOS };
  }
}
