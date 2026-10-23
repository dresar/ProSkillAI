export interface TrendingRepo {
  rank: number;
  id: number;
  name: string;
  fullName: string;
  owner: {
    login: string;
    avatarUrl: string;
    htmlUrl: string;
    type: string;
  };
  description: string;
  htmlUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  languageColor: string;
  topics: string[];
  license: string;
  updatedAt: string;
  createdAt: string;
  defaultBranch: string;
}

export type TrendingTimeRange = "daily" | "weekly" | "monthly" | "all";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Zig: "#ec915c",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
};

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] || "#8b949e";
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

const FALLBACK_TRENDING_REPOSITORIES: Omit<TrendingRepo, "rank">[] = [
  {
    id: 10270250,
    name: "react",
    fullName: "facebook/react",
    owner: {
      login: "facebook",
      avatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4",
      htmlUrl: "https://github.com/facebook",
      type: "Organization",
    },
    description: "The library for web and native user interfaces. Build component-driven architectures effortlessly.",
    htmlUrl: "https://github.com/facebook/react",
    stars: 234120,
    forks: 46210,
    openIssues: 1620,
    language: "JavaScript",
    languageColor: "#f7df1e",
    topics: ["react", "javascript", "ui", "frontend", "components"],
    license: "MIT",
    updatedAt: "2026-10-23T12:00:00Z",
    createdAt: "2013-05-24T16:15:54Z",
    defaultBranch: "main",
  },
  {
    id: 11730342,
    name: "vue",
    fullName: "vuejs/vue",
    owner: {
      login: "vuejs",
      avatarUrl: "https://avatars.githubusercontent.com/u/6128107?v=4",
      htmlUrl: "https://github.com/vuejs",
      type: "Organization",
    },
    description: "Progressive JavaScript framework for building modern user interfaces on the web.",
    htmlUrl: "https://github.com/vuejs/vue",
    stars: 209500,
    forks: 33800,
    openIssues: 540,
    language: "TypeScript",
    languageColor: "#3178c6",
    topics: ["vue", "framework", "frontend", "javascript", "ui"],
    license: "MIT",
    updatedAt: "2026-10-23T10:14:00Z",
    createdAt: "2013-07-29T03:24:51Z",
    defaultBranch: "main",
  },
  {
    id: 70107786,
    name: "next.js",
    fullName: "vercel/next.js",
    owner: {
      login: "vercel",
      avatarUrl: "https://avatars.githubusercontent.com/u/14985020?v=4",
      htmlUrl: "https://github.com/vercel",
      type: "Organization",
    },
    description: "The React Framework for the Web. Used by top global development teams for full-stack speed.",
    htmlUrl: "https://github.com/vercel/next.js",
    stars: 132450,
    forks: 27100,
    openIssues: 2600,
    language: "JavaScript",
    languageColor: "#f7df1e",
    topics: ["react", "nextjs", "ssr", "typescript", "fullstack"],
    license: "MIT",
    updatedAt: "2026-10-23T14:22:00Z",
    createdAt: "2016-10-05T23:32:51Z",
    defaultBranch: "canary",
  },
  {
    id: 657788414,
    name: "langchain",
    fullName: "langchain-ai/langchain",
    owner: {
      login: "langchain-ai",
      avatarUrl: "https://avatars.githubusercontent.com/u/126733545?v=4",
      htmlUrl: "https://github.com/langchain-ai",
      type: "Organization",
    },
    description: "Building applications with LLMs through composability, agentic workflows, and context retrieval.",
    htmlUrl: "https://github.com/langchain-ai/langchain",
    stars: 104200,
    forks: 16800,
    openIssues: 2150,
    language: "Python",
    languageColor: "#3572A5",
    topics: ["llm", "agents", "langchain", "ai", "python"],
    license: "MIT",
    updatedAt: "2026-10-23T15:10:00Z",
    createdAt: "2022-10-17T02:58:36Z",
    defaultBranch: "master",
  },
  {
    id: 614050893,
    name: "auto-gpt",
    fullName: "Significant-Gravitas/AutoGPT",
    owner: {
      login: "Significant-Gravitas",
      avatarUrl: "https://avatars.githubusercontent.com/u/130107293?v=4",
      htmlUrl: "https://github.com/Significant-Gravitas",
      type: "Organization",
    },
    description: "The visionary autonomous agent toolkit for building, testing, and deploying intelligent AI agents.",
    htmlUrl: "https://github.com/Significant-Gravitas/AutoGPT",
    stars: 172100,
    forks: 45200,
    openIssues: 1840,
    language: "Python",
    languageColor: "#3572A5",
    topics: ["autonomous-agents", "gpt-4", "ai", "agent", "llm"],
    license: "MIT",
    updatedAt: "2026-10-23T11:45:00Z",
    createdAt: "2023-03-16T09:21:07Z",
    defaultBranch: "master",
  },
  {
    id: 6098020,
    name: "d3",
    fullName: "d3/d3",
    owner: {
      login: "d3",
      avatarUrl: "https://avatars.githubusercontent.com/u/1562726?v=4",
      htmlUrl: "https://github.com/d3",
      type: "Organization",
    },
    description: "Bring data to life with SVG, Canvas and HTML. The leading visualization standard for the web.",
    htmlUrl: "https://github.com/d3/d3",
    stars: 109300,
    forks: 23400,
    openIssues: 220,
    language: "JavaScript",
    languageColor: "#f7df1e",
    topics: ["data-visualization", "svg", "charts", "javascript"],
    license: "ISC",
    updatedAt: "2026-10-23T08:12:00Z",
    createdAt: "2012-10-06T19:54:15Z",
    defaultBranch: "main",
  },
  {
    id: 28457823,
    name: "freeCodeCamp",
    fullName: "freeCodeCamp/freeCodeCamp",
    owner: {
      login: "freeCodeCamp",
      avatarUrl: "https://avatars.githubusercontent.com/u/9892522?v=4",
      htmlUrl: "https://github.com/freeCodeCamp",
      type: "Organization",
    },
    description: "freeCodeCamp.org's open-source codebase and curriculum. Learn to code for free.",
    htmlUrl: "https://github.com/freeCodeCamp/freeCodeCamp",
    stars: 412500,
    forks: 39500,
    openIssues: 380,
    language: "TypeScript",
    languageColor: "#3178c6",
    topics: ["education", "javascript", "react", "curriculum"],
    license: "BSD-3-Clause",
    updatedAt: "2026-10-23T15:30:00Z",
    createdAt: "2014-12-24T17:49:19Z",
    defaultBranch: "main",
  },
  {
    id: 177730863,
    name: "996.ICU",
    fullName: "996icu/996.ICU",
    owner: {
      login: "996icu",
      avatarUrl: "https://avatars.githubusercontent.com/u/48942249?v=4",
      htmlUrl: "https://github.com/996icu",
      type: "Organization",
    },
    description: "Repo for counting stars and tech worker rights initiatives worldwide.",
    htmlUrl: "https://github.com/996icu/996.ICU",
    stars: 270800,
    forks: 21500,
    openIssues: 120,
    language: "Rust",
    languageColor: "#dea584",
    topics: ["workers-rights", "developer-health"],
    license: "MIT",
    updatedAt: "2026-10-23T06:00:00Z",
    createdAt: "2019-03-26T07:31:14Z",
    defaultBranch: "master",
  },
  {
    id: 41881900,
    name: "vscode",
    fullName: "microsoft/vscode",
    owner: {
      login: "microsoft",
      avatarUrl: "https://avatars.githubusercontent.com/u/6154722?v=4",
      htmlUrl: "https://github.com/microsoft",
      type: "Organization",
    },
    description: "Visual Studio Code. Code editing. Redefined. Built in TypeScript with extensibility at its core.",
    htmlUrl: "https://github.com/microsoft/vscode",
    stars: 167300,
    forks: 35100,
    openIssues: 5200,
    language: "TypeScript",
    languageColor: "#3178c6",
    topics: ["editor", "electron", "typescript", "developer-tools"],
    license: "MIT",
    updatedAt: "2026-10-23T15:00:00Z",
    createdAt: "2015-09-03T20:23:38Z",
    defaultBranch: "main",
  },
  {
    id: 45717250,
    name: "tensorflow",
    fullName: "tensorflow/tensorflow",
    owner: {
      login: "tensorflow",
      avatarUrl: "https://avatars.githubusercontent.com/u/15658638?v=4",
      htmlUrl: "https://github.com/tensorflow",
      type: "Organization",
    },
    description: "An open source machine learning framework for everyone, powering production deep learning systems.",
    htmlUrl: "https://github.com/tensorflow/tensorflow",
    stars: 189200,
    forks: 90100,
    openIssues: 4100,
    language: "C++",
    languageColor: "#f34b7d",
    topics: ["machine-learning", "deep-learning", "python", "neural-network"],
    license: "Apache-2.0",
    updatedAt: "2026-10-23T13:40:00Z",
    createdAt: "2015-11-07T01:19:20Z",
    defaultBranch: "master",
  },
  {
    id: 65600975,
    name: "pytorch",
    fullName: "pytorch/pytorch",
    owner: {
      login: "pytorch",
      avatarUrl: "https://avatars.githubusercontent.com/u/21003710?v=4",
      htmlUrl: "https://github.com/pytorch",
      type: "Organization",
    },
    description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration.",
    htmlUrl: "https://github.com/pytorch/pytorch",
    stars: 93400,
    forks: 23600,
    openIssues: 16100,
    language: "Python",
    languageColor: "#3572A5",
    topics: ["deep-learning", "machine-learning", "python", "gpu"],
    license: "BSD-3-Clause",
    updatedAt: "2026-10-23T14:50:00Z",
    createdAt: "2016-08-13T05:26:41Z",
    defaultBranch: "main",
  },
  {
    id: 13491895,
    name: "tailwind-css",
    fullName: "tailwindlabs/tailwindcss",
    owner: {
      login: "tailwindlabs",
      avatarUrl: "https://avatars.githubusercontent.com/u/67104415?v=4",
      htmlUrl: "https://github.com/tailwindlabs",
      type: "Organization",
    },
    description: "A utility-first CSS framework for rapid UI development without leaving your HTML.",
    htmlUrl: "https://github.com/tailwindlabs/tailwindcss",
    stars: 86400,
    forks: 4300,
    openIssues: 65,
    language: "TypeScript",
    languageColor: "#3178c6",
    topics: ["css", "tailwind", "design-system", "frontend"],
    license: "MIT",
    updatedAt: "2026-10-23T15:15:00Z",
    createdAt: "2017-11-01T12:00:00Z",
    defaultBranch: "main",
  },
  {
    id: 12256376,
    name: "rust",
    fullName: "rust-lang/rust",
    owner: {
      login: "rust-lang",
      avatarUrl: "https://avatars.githubusercontent.com/u/5430905?v=4",
      htmlUrl: "https://github.com/rust-lang",
      type: "Organization",
    },
    description: "Empowering everyone to build reliable and efficient software with zero-cost abstractions.",
    htmlUrl: "https://github.com/rust-lang/rust",
    stars: 102400,
    forks: 13100,
    openIssues: 9800,
    language: "Rust",
    languageColor: "#dea584",
    topics: ["compiler", "systems-programming", "rust", "language"],
    license: "MIT",
    updatedAt: "2026-10-23T15:45:00Z",
    createdAt: "2010-06-16T20:39:03Z",
    defaultBranch: "master",
  },
  {
    id: 23096959,
    name: "go",
    fullName: "golang/go",
    owner: {
      login: "golang",
      avatarUrl: "https://avatars.githubusercontent.com/u/4314092?v=4",
      htmlUrl: "https://github.com/golang",
      type: "Organization",
    },
    description: "The Go programming language open source project for fast, scalable concurrency.",
    htmlUrl: "https://github.com/golang/go",
    stars: 127600,
    forks: 17800,
    openIssues: 9200,
    language: "Go",
    languageColor: "#00ADD8",
    topics: ["go", "golang", "concurrency", "compiler"],
    license: "BSD-3-Clause",
    updatedAt: "2026-10-23T14:30:00Z",
    createdAt: "2014-08-19T04:33:40Z",
    defaultBranch: "master",
  },
  {
    id: 2325298,
    name: "linux",
    fullName: "torvalds/linux",
    owner: {
      login: "torvalds",
      avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
      htmlUrl: "https://github.com/torvalds",
      type: "User",
    },
    description: "Linux kernel source tree by Linus Torvalds. The foundation of modern cloud and device operating systems.",
    htmlUrl: "https://github.com/torvalds/linux",
    stars: 189400,
    forks: 55400,
    openIssues: 380,
    language: "C",
    languageColor: "#555555",
    topics: ["kernel", "os", "linux", "c"],
    license: "GPL-2.0",
    updatedAt: "2026-10-23T15:00:00Z",
    createdAt: "2011-09-04T22:48:12Z",
    defaultBranch: "master",
  },
  {
    id: 1119271,
    name: "deno",
    fullName: "denoland/deno",
    owner: {
      login: "denoland",
      avatarUrl: "https://avatars.githubusercontent.com/u/42048915?v=4",
      htmlUrl: "https://github.com/denoland",
      type: "Organization",
    },
    description: "A modern runtime for JavaScript and TypeScript with secure defaults and zero-config tooling.",
    htmlUrl: "https://github.com/denoland/deno",
    stars: 96800,
    forks: 5500,
    openIssues: 1540,
    language: "Rust",
    languageColor: "#dea584",
    topics: ["deno", "typescript", "javascript", "runtime", "v8"],
    license: "MIT",
    updatedAt: "2026-10-23T13:20:00Z",
    createdAt: "2018-05-20T19:28:44Z",
    defaultBranch: "main",
  },
  {
    id: 673413945,
    name: "ollama",
    fullName: "ollama/ollama",
    owner: {
      login: "ollama",
      avatarUrl: "https://avatars.githubusercontent.com/u/142967004?v=4",
      htmlUrl: "https://github.com/ollama",
      type: "Organization",
    },
    description: "Get up and running with Llama 3.3, Mistral, Gemma 2, and other large language models locally.",
    htmlUrl: "https://github.com/ollama/ollama",
    stars: 114500,
    forks: 9700,
    openIssues: 980,
    language: "Go",
    languageColor: "#00ADD8",
    topics: ["llm", "llama", "local-ai", "inference", "go"],
    license: "MIT",
    updatedAt: "2026-10-23T15:20:00Z",
    createdAt: "2023-06-21T18:00:00Z",
    defaultBranch: "main",
  },
  {
    id: 60234149,
    name: "bun",
    fullName: "oven-sh/bun",
    owner: {
      login: "oven-sh",
      avatarUrl: "https://avatars.githubusercontent.com/u/84687498?v=4",
      htmlUrl: "https://github.com/oven-sh",
      type: "Organization",
    },
    description: "Incredibly fast JavaScript runtime, bundler, test runner, and package manager – all in one.",
    htmlUrl: "https://github.com/oven-sh/bun",
    stars: 76500,
    forks: 2400,
    openIssues: 1800,
    language: "Zig",
    languageColor: "#ec915c",
    topics: ["javascript", "runtime", "bundler", "zig", "package-manager"],
    license: "MIT",
    updatedAt: "2026-10-23T14:40:00Z",
    createdAt: "2021-04-12T16:00:00Z",
    defaultBranch: "main",
  },
  {
    id: 641884074,
    name: "vllm",
    fullName: "vllm-project/vllm",
    owner: {
      login: "vllm-project",
      avatarUrl: "https://avatars.githubusercontent.com/u/137797149?v=4",
      htmlUrl: "https://github.com/vllm-project",
      type: "Organization",
    },
    description: "A high-throughput and memory-efficient LLM inference and serving engine with PagedAttention.",
    htmlUrl: "https://github.com/vllm-project/vllm",
    stars: 37400,
    forks: 5600,
    openIssues: 1250,
    language: "Python",
    languageColor: "#3572A5",
    topics: ["llm-inference", "serving", "cuda", "vllm", "python"],
    license: "Apache-2.0",
    updatedAt: "2026-10-23T15:10:00Z",
    createdAt: "2023-05-17T06:00:00Z",
    defaultBranch: "main",
  },
  {
    id: 728876483,
    name: "dify",
    fullName: "langgenius/dify",
    owner: {
      login: "langgenius",
      avatarUrl: "https://avatars.githubusercontent.com/u/120531585?v=4",
      htmlUrl: "https://github.com/langgenius",
      type: "Organization",
    },
    description: "An open-source LLM app development platform combining AI workflow, RAG pipeline, and agent capabilities.",
    htmlUrl: "https://github.com/langgenius/dify",
    stars: 68900,
    forks: 9800,
    openIssues: 450,
    language: "TypeScript",
    languageColor: "#3178c6",
    topics: ["llm-app", "rag", "agent", "workflow", "ai-orchestration"],
    license: "Apache-2.0",
    updatedAt: "2026-10-23T15:25:00Z",
    createdAt: "2023-03-01T00:00:00Z",
    defaultBranch: "main",
  },
];

export async function fetchGitHubTrending({
  range = "all",
  language = "",
}: {
  range?: TrendingTimeRange;
  language?: string;
} = {}): Promise<{ repos: TrendingRepo[]; isLive: boolean; total: number }> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ProSkillAI-Trending",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let dateFilter = "";
  const now = new Date();
  if (range === "daily") {
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    dateFilter = `created:>${yesterday.toISOString().split("T")[0]}`;
  } else if (range === "weekly") {
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = `created:>${lastWeek.toISOString().split("T")[0]}`;
  } else if (range === "monthly") {
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateFilter = `created:>${lastMonth.toISOString().split("T")[0]}`;
  }

  let queryParts: string[] = [];
  if (dateFilter) {
    queryParts.push(dateFilter);
    queryParts.push("stars:>10");
  } else {
    queryParts.push("stars:>5000");
  }

  if (language && language.trim().length > 0 && language.toLowerCase() !== "all") {
    queryParts.push(`language:${encodeURIComponent(language.trim())}`);
  }

  const query = queryParts.join(" ");

  try {
    const res = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=100`,
      {
        headers,
        next: { revalidate: 300 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.items) && data.items.length > 0) {
        const repos: TrendingRepo[] = data.items.map((item: any, idx: number) => ({
          rank: idx + 1,
          id: item.id,
          name: item.name,
          fullName: item.full_name,
          owner: {
            login: item.owner?.login || "anonymous",
            avatarUrl: item.owner?.avatar_url || "https://avatars.githubusercontent.com/u/9919?v=4",
            htmlUrl: item.owner?.html_url || `https://github.com/${item.owner?.login || ""}`,
            type: item.owner?.type || "User",
          },
          description: item.description || "No description provided.",
          htmlUrl: item.html_url,
          stars: item.stargazers_count ?? 0,
          forks: item.forks_count ?? 0,
          openIssues: item.open_issues_count ?? 0,
          language: item.language || "Plain Text",
          languageColor: getLanguageColor(item.language || ""),
          topics: Array.isArray(item.topics) ? item.topics.slice(0, 5) : [],
          license: item.license?.spdx_id || item.license?.name || "None",
          updatedAt: item.updated_at || item.pushed_at,
          createdAt: item.created_at,
          defaultBranch: item.default_branch || "main",
        }));

        return { repos, isLive: true, total: data.total_count ?? repos.length };
      }
    }
  } catch {}

  const filteredFallback = language && language.toLowerCase() !== "all"
    ? FALLBACK_TRENDING_REPOSITORIES.filter(r => r.language.toLowerCase() === language.toLowerCase())
    : FALLBACK_TRENDING_REPOSITORIES;

  const repos: TrendingRepo[] = filteredFallback.map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  return { repos, isLive: false, total: repos.length };
}

export async function fetchRepoReadme(owner: string, repo: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw",
    "User-Agent": "ProSkillAI-ReadmeViewer",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers,
      next: { revalidate: 600 },
    });

    if (res.ok) {
      const text = await res.text();
      if (text.trim().length > 0) {
        return text;
      }
    }
  } catch {}

  try {
    const rawRes = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { revalidate: 600 },
      }
    );
    if (rawRes.ok) {
      return await rawRes.text();
    }
  } catch {}

  return `# ${owner}/${repo}\n\nRepository details and source code are available at [https://github.com/${owner}/${repo}](https://github.com/${owner}/${repo}).`;
}
