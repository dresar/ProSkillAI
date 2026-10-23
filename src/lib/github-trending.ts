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
  Markdown: "#083fa1",
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

export const FALLBACK_TRENDING_REPOSITORIES: Omit<TrendingRepo, "rank">[] = [
  {
    "id": 132750724,
    "name": "build-your-own-x",
    "fullName": "codecrafters-io/build-your-own-x",
    "owner": {
      "login": "codecrafters-io",
      "avatarUrl": "https://avatars.githubusercontent.com/u/58904235?v=4",
      "htmlUrl": "https://github.com/codecrafters-io",
      "type": "Organization"
    },
    "description": "Master programming by recreating your favorite technologies from scratch.",
    "htmlUrl": "https://github.com/codecrafters-io/build-your-own-x",
    "stars": 555647,
    "forks": 52033,
    "openIssues": 681,
    "language": "Markdown",
    "languageColor": "#083fa1",
    "topics": [
      "awesome-list",
      "free",
      "programming",
      "tutorial-code",
      "tutorial-exercises"
    ],
    "license": "None",
    "updatedAt": "2026-10-23T16:11:13Z",
    "createdAt": "2018-05-09T12:03:18Z",
    "defaultBranch": "master"
  },
  {
    "id": 21737465,
    "name": "awesome",
    "fullName": "sindresorhus/awesome",
    "owner": {
      "login": "sindresorhus",
      "avatarUrl": "https://avatars.githubusercontent.com/u/170270?v=4",
      "htmlUrl": "https://github.com/sindresorhus",
      "type": "User"
    },
    "description": "😎 Awesome lists about all kinds of interesting topics [NOTE: Pull requests are temporarily disabled until I have a chance to catch up with the existing ones]",
    "htmlUrl": "https://github.com/sindresorhus/awesome",
    "stars": 523497,
    "forks": 37702,
    "openIssues": 105,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "awesome",
      "awesome-list",
      "lists",
      "resources",
      "unicorns"
    ],
    "license": "CC0-1.0",
    "updatedAt": "2026-10-23T16:11:39Z",
    "createdAt": "2014-07-11T13:42:37Z",
    "defaultBranch": "main"
  },
  {
    "id": 54346799,
    "name": "public-apis",
    "fullName": "public-apis/public-apis",
    "owner": {
      "login": "public-apis",
      "avatarUrl": "https://avatars.githubusercontent.com/u/51121562?v=4",
      "htmlUrl": "https://github.com/public-apis",
      "type": "Organization"
    },
    "description": "A collective list of free APIs",
    "htmlUrl": "https://github.com/public-apis/public-apis",
    "stars": 491605,
    "forks": 54691,
    "openIssues": 2336,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "api",
      "apis",
      "dataset",
      "development",
      "free"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:08:42Z",
    "createdAt": "2016-03-20T23:49:42Z",
    "defaultBranch": "master"
  },
  {
    "id": 28457823,
    "name": "freeCodeCamp",
    "fullName": "freeCodeCamp/freeCodeCamp",
    "owner": {
      "login": "freeCodeCamp",
      "avatarUrl": "https://avatars.githubusercontent.com/u/9892522?v=4",
      "htmlUrl": "https://github.com/freeCodeCamp",
      "type": "Organization"
    },
    "description": "freeCodeCamp.org's open-source codebase and curriculum. Learn math, programming, and computer science for free.",
    "htmlUrl": "https://github.com/freeCodeCamp/freeCodeCamp",
    "stars": 457770,
    "forks": 49354,
    "openIssues": 186,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "careers",
      "certification",
      "community",
      "curriculum",
      "d3"
    ],
    "license": "BSD-3-Clause",
    "updatedAt": "2026-10-23T15:50:09Z",
    "createdAt": "2014-12-24T17:49:19Z",
    "defaultBranch": "main"
  },
  {
    "id": 13491895,
    "name": "free-programming-books",
    "fullName": "EbookFoundation/free-programming-books",
    "owner": {
      "login": "EbookFoundation",
      "avatarUrl": "https://avatars.githubusercontent.com/u/14127308?v=4",
      "htmlUrl": "https://github.com/EbookFoundation",
      "type": "Organization"
    },
    "description": ":books: Freely available programming books",
    "htmlUrl": "https://github.com/EbookFoundation/free-programming-books",
    "stars": 399905,
    "forks": 66968,
    "openIssues": 90,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "books",
      "education",
      "hacktoberfest",
      "list",
      "resource"
    ],
    "license": "CC-BY-4.0",
    "updatedAt": "2026-10-23T16:13:13Z",
    "createdAt": "2013-10-11T06:50:37Z",
    "defaultBranch": "main"
  },
  {
    "id": 1103012935,
    "name": "openclaw",
    "fullName": "openclaw/openclaw",
    "owner": {
      "login": "openclaw",
      "avatarUrl": "https://avatars.githubusercontent.com/u/252820863?v=4",
      "htmlUrl": "https://github.com/openclaw",
      "type": "Organization"
    },
    "description": "The AI that really does things. Any OS. Any Platform. The lobster way. 🦞 ",
    "htmlUrl": "https://github.com/openclaw/openclaw",
    "stars": 392853,
    "forks": 82571,
    "openIssues": 8884,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "ai",
      "assistant",
      "crustacean",
      "molty",
      "openclaw"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:11:30Z",
    "createdAt": "2025-11-24T10:16:47Z",
    "defaultBranch": "main"
  },
  {
    "id": 83222441,
    "name": "system-design-primer",
    "fullName": "donnemartin/system-design-primer",
    "owner": {
      "login": "donnemartin",
      "avatarUrl": "https://avatars.githubusercontent.com/u/5458997?v=4",
      "htmlUrl": "https://github.com/donnemartin",
      "type": "User"
    },
    "description": "Learn how to design large-scale systems. Prep for the system design interview.  Includes Anki flashcards.",
    "htmlUrl": "https://github.com/donnemartin/system-design-primer",
    "stars": 375301,
    "forks": 58950,
    "openIssues": 631,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "design",
      "design-patterns",
      "design-system",
      "development",
      "interview"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:12:58Z",
    "createdAt": "2017-02-26T16:15:28Z",
    "defaultBranch": "master"
  },
  {
    "id": 1209966933,
    "name": "rea",
    "fullName": "morluto/rea",
    "owner": {
      "login": "morluto",
      "avatarUrl": "https://avatars.githubusercontent.com/u/76467478?v=4",
      "htmlUrl": "https://github.com/morluto",
      "type": "User"
    },
    "description": "Reverse engineer anything with agents, from app behavior down to native binaries.",
    "htmlUrl": "https://github.com/morluto/rea",
    "stars": 371444,
    "forks": 93030,
    "openIssues": 1707,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "agent-skills",
      "ai-agents",
      "binary-analysis",
      "claude-code",
      "cli"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:12:53Z",
    "createdAt": "2026-04-14T00:51:32Z",
    "defaultBranch": "main"
  },
  {
    "id": 85077558,
    "name": "developer-roadmap",
    "fullName": "nilbuild/developer-roadmap",
    "owner": {
      "login": "nilbuild",
      "avatarUrl": "https://avatars.githubusercontent.com/u/4921183?v=4",
      "htmlUrl": "https://github.com/nilbuild",
      "type": "User"
    },
    "description": "Interactive roadmaps, guides and other educational content to help developers grow in their careers.",
    "htmlUrl": "https://github.com/nilbuild/developer-roadmap",
    "stars": 370215,
    "forks": 45132,
    "openIssues": 4,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "angular-roadmap",
      "backend-roadmap",
      "blockchain-roadmap",
      "computer-science",
      "dba-roadmap"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:02:24Z",
    "createdAt": "2017-03-15T13:45:52Z",
    "defaultBranch": "master"
  },
  {
    "id": 60493101,
    "name": "coding-interview-university",
    "fullName": "jwasham/coding-interview-university",
    "owner": {
      "login": "jwasham",
      "avatarUrl": "https://avatars.githubusercontent.com/u/3771963?v=4",
      "htmlUrl": "https://github.com/jwasham",
      "type": "User"
    },
    "description": "A complete computer science study plan to become a software engineer.",
    "htmlUrl": "https://github.com/jwasham/coding-interview-university",
    "stars": 363297,
    "forks": 85036,
    "openIssues": 129,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "algorithm",
      "algorithms",
      "coding-interview",
      "coding-interviews",
      "computer-science"
    ],
    "license": "CC-BY-SA-4.0",
    "updatedAt": "2026-10-23T15:40:14Z",
    "createdAt": "2016-06-06T02:34:12Z",
    "defaultBranch": "main"
  },
  {
    "id": 21289110,
    "name": "awesome-python",
    "fullName": "vinta/awesome-python",
    "owner": {
      "login": "vinta",
      "avatarUrl": "https://avatars.githubusercontent.com/u/652070?v=4",
      "htmlUrl": "https://github.com/vinta",
      "type": "User"
    },
    "description": "The definitive list that answers \"I want to do X in Python, which tool should I use?\"",
    "htmlUrl": "https://github.com/vinta/awesome-python",
    "stars": 329665,
    "forks": 28979,
    "openIssues": 17,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "awesome",
      "awesome-list",
      "python",
      "python-frameworks",
      "python-libraries"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:10:40Z",
    "createdAt": "2014-06-27T21:00:06Z",
    "defaultBranch": "master"
  },
  {
    "id": 36633370,
    "name": "awesome-selfhosted",
    "fullName": "awesome-selfhosted/awesome-selfhosted",
    "owner": {
      "login": "awesome-selfhosted",
      "avatarUrl": "https://avatars.githubusercontent.com/u/24270415?v=4",
      "htmlUrl": "https://github.com/awesome-selfhosted",
      "type": "Organization"
    },
    "description": "A list of Free Software network services and web applications which can be hosted on your own servers",
    "htmlUrl": "https://github.com/awesome-selfhosted/awesome-selfhosted",
    "stars": 329596,
    "forks": 15491,
    "openIssues": 0,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "awesome",
      "awesome-list",
      "cloud",
      "free-software",
      "hosting"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:08:58Z",
    "createdAt": "2015-06-01T02:33:17Z",
    "defaultBranch": "master"
  },
  {
    "id": 1073224795,
    "name": "superpowers",
    "fullName": "obra/superpowers",
    "owner": {
      "login": "obra",
      "avatarUrl": "https://avatars.githubusercontent.com/u/45416?v=4",
      "htmlUrl": "https://github.com/obra",
      "type": "User"
    },
    "description": "An agentic skills framework & software development methodology that works.",
    "htmlUrl": "https://github.com/obra/superpowers",
    "stars": 304095,
    "forks": 27090,
    "openIssues": 353,
    "language": "Shell",
    "languageColor": "#89e051",
    "topics": [
      "ai",
      "brainstorming",
      "coding",
      "obra",
      "sdlc"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:13:11Z",
    "createdAt": "2025-10-09T19:45:18Z",
    "defaultBranch": "main"
  },
  {
    "id": 1148788086,
    "name": "skills",
    "fullName": "mattpocock/skills",
    "owner": {
      "login": "mattpocock",
      "avatarUrl": "https://avatars.githubusercontent.com/u/28293365?v=4",
      "htmlUrl": "https://github.com/mattpocock",
      "type": "User"
    },
    "description": "Skills for Real Engineers. Straight from my .agents directory.",
    "htmlUrl": "https://github.com/mattpocock/skills",
    "stars": 301585,
    "forks": 25348,
    "openIssues": 200,
    "language": "Shell",
    "languageColor": "#89e051",
    "topics": [],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:11:55Z",
    "createdAt": "2026-02-03T11:15:53Z",
    "defaultBranch": "main"
  },
  {
    "id": 88011908,
    "name": "project-based-learning",
    "fullName": "practical-tutorials/project-based-learning",
    "owner": {
      "login": "practical-tutorials",
      "avatarUrl": "https://avatars.githubusercontent.com/u/89421154?v=4",
      "htmlUrl": "https://github.com/practical-tutorials",
      "type": "Organization"
    },
    "description": "Curated list of project-based tutorials",
    "htmlUrl": "https://github.com/practical-tutorials/project-based-learning",
    "stars": 287706,
    "forks": 36693,
    "openIssues": 238,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "beginner-project",
      "cpp",
      "golang",
      "javascript",
      "project"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:05:30Z",
    "createdAt": "2017-04-12T05:07:46Z",
    "defaultBranch": "master"
  },
  {
    "id": 1136590548,
    "name": "ECC",
    "fullName": "affaan-m/ECC",
    "owner": {
      "login": "affaan-m",
      "avatarUrl": "https://avatars.githubusercontent.com/u/124439313?v=4",
      "htmlUrl": "https://github.com/affaan-m",
      "type": "User"
    },
    "description": "The agent harness performance optimization system. Skills, instincts, memory, security, and research-first development for Claude Code, Codex, Opencode, Cursor and beyond.",
    "htmlUrl": "https://github.com/affaan-m/ECC",
    "stars": 287079,
    "forks": 42577,
    "openIssues": 264,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "ai-agents",
      "anthropic",
      "claude",
      "claude-code",
      "developer-tools"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:12:55Z",
    "createdAt": "2026-01-18T00:51:51Z",
    "defaultBranch": "main"
  },
  {
    "id": 177736533,
    "name": "996.ICU",
    "fullName": "996icu/996.ICU",
    "owner": {
      "login": "996icu",
      "avatarUrl": "https://avatars.githubusercontent.com/u/48942249?v=4",
      "htmlUrl": "https://github.com/996icu",
      "type": "User"
    },
    "description": "Repo for counting stars and contributing. Press F to pay respect to glorious developers.",
    "htmlUrl": "https://github.com/996icu/996.ICU",
    "stars": 277159,
    "forks": 20675,
    "openIssues": 16689,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T14:59:47Z",
    "createdAt": "2019-03-26T07:31:14Z",
    "defaultBranch": "master"
  },
  {
    "id": 1333065091,
    "name": "deepseek-harness",
    "fullName": "deepseek-ai/deepseek-harness",
    "owner": {
      "login": "deepseek-ai",
      "avatarUrl": "https://avatars.githubusercontent.com/u/148330874?v=4",
      "htmlUrl": "https://github.com/deepseek-ai",
      "type": "Organization"
    },
    "description": "DeepSeek Harness: Everything is a Plugin.",
    "htmlUrl": "https://github.com/deepseek-ai/deepseek-harness",
    "stars": 259255,
    "forks": 31297,
    "openIssues": 0,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "ai-agents",
      "cordis",
      "dsh",
      "dsh-plugin"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:12:49Z",
    "createdAt": "2026-08-13T11:56:32Z",
    "defaultBranch": "master"
  },
  {
    "id": 1024554267,
    "name": "hermes-agent",
    "fullName": "NousResearch/hermes-agent",
    "owner": {
      "login": "NousResearch",
      "avatarUrl": "https://avatars.githubusercontent.com/u/134168893?v=4",
      "htmlUrl": "https://github.com/NousResearch",
      "type": "Organization"
    },
    "description": "The agent that grows with you",
    "htmlUrl": "https://github.com/NousResearch/hermes-agent",
    "stars": 256462,
    "forks": 56048,
    "openIssues": 50676,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai",
      "ai-agent",
      "ai-agents",
      "anthropic",
      "chatgpt"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:12:45Z",
    "createdAt": "2025-07-22T22:22:28Z",
    "defaultBranch": "main"
  },
  {
    "id": 2325298,
    "name": "linux",
    "fullName": "torvalds/linux",
    "owner": {
      "login": "torvalds",
      "avatarUrl": "https://avatars.githubusercontent.com/u/1024025?v=4",
      "htmlUrl": "https://github.com/torvalds",
      "type": "User"
    },
    "description": "Linux kernel source tree",
    "htmlUrl": "https://github.com/torvalds/linux",
    "stars": 253274,
    "forks": 68147,
    "openIssues": 3,
    "language": "C",
    "languageColor": "#555555",
    "topics": [],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:09:16Z",
    "createdAt": "2011-09-04T22:48:12Z",
    "defaultBranch": "master"
  },
  {
    "id": 138393139,
    "name": "the-book-of-secret-knowledge",
    "fullName": "trimstray/the-book-of-secret-knowledge",
    "owner": {
      "login": "trimstray",
      "avatarUrl": "https://avatars.githubusercontent.com/u/31127917?v=4",
      "htmlUrl": "https://github.com/trimstray",
      "type": "User"
    },
    "description": "A collection of inspiring lists, manuals, cheatsheets, blogs, hacks, one-liners, cli/web tools and more.",
    "htmlUrl": "https://github.com/trimstray/the-book-of-secret-knowledge",
    "stars": 252598,
    "forks": 14606,
    "openIssues": 174,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "awesome",
      "awesome-list",
      "bsd",
      "cheatsheets",
      "devops"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:12:24Z",
    "createdAt": "2018-06-23T10:43:14Z",
    "defaultBranch": "master"
  },
  {
    "id": 10270250,
    "name": "react",
    "fullName": "react/react",
    "owner": {
      "login": "react",
      "avatarUrl": "https://avatars.githubusercontent.com/u/102812?v=4",
      "htmlUrl": "https://github.com/react",
      "type": "Organization"
    },
    "description": "The library for web and native user interfaces.",
    "htmlUrl": "https://github.com/react/react",
    "stars": 251718,
    "forks": 51568,
    "openIssues": 1473,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "declarative",
      "frontend",
      "javascript",
      "library",
      "react"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:11:53Z",
    "createdAt": "2013-05-24T16:15:54Z",
    "defaultBranch": "main"
  },
  {
    "id": 63476337,
    "name": "Python",
    "fullName": "TheAlgorithms/Python",
    "owner": {
      "login": "TheAlgorithms",
      "avatarUrl": "https://avatars.githubusercontent.com/u/20487725?v=4",
      "htmlUrl": "https://github.com/TheAlgorithms",
      "type": "Organization"
    },
    "description": "All Algorithms implemented in Python",
    "htmlUrl": "https://github.com/TheAlgorithms/Python",
    "stars": 225485,
    "forks": 51208,
    "openIssues": 47,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "algorithm",
      "algorithm-competitions",
      "algorithms-implemented",
      "algos",
      "community-driven"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:55:02Z",
    "createdAt": "2016-07-16T09:44:01Z",
    "defaultBranch": "master"
  },
  {
    "id": 1142983825,
    "name": "andrej-karpathy-skills",
    "fullName": "multica-ai/andrej-karpathy-skills",
    "owner": {
      "login": "multica-ai",
      "avatarUrl": "https://avatars.githubusercontent.com/u/254743058?v=4",
      "htmlUrl": "https://github.com/multica-ai",
      "type": "Organization"
    },
    "description": "A single CLAUDE.md file to improve Claude Code behavior, derived from Andrej Karpathy's observations on LLM coding pitfalls.",
    "htmlUrl": "https://github.com/multica-ai/andrej-karpathy-skills",
    "stars": 222815,
    "forks": 22333,
    "openIssues": 137,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [],
    "license": "None",
    "updatedAt": "2026-10-23T16:07:06Z",
    "createdAt": "2026-01-27T03:53:13Z",
    "defaultBranch": "main"
  },
  {
    "id": 975734319,
    "name": "opencode",
    "fullName": "anomalyco/opencode",
    "owner": {
      "login": "anomalyco",
      "avatarUrl": "https://avatars.githubusercontent.com/u/66570915?v=4",
      "htmlUrl": "https://github.com/anomalyco",
      "type": "Organization"
    },
    "description": "The open source coding agent.",
    "htmlUrl": "https://github.com/anomalyco/opencode",
    "stars": 220503,
    "forks": 29490,
    "openIssues": 3661,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:11:32Z",
    "createdAt": "2025-04-30T20:08:00Z",
    "defaultBranch": "dev"
  },
  {
    "id": 11730342,
    "name": "vue",
    "fullName": "vuejs/vue",
    "owner": {
      "login": "vuejs",
      "avatarUrl": "https://avatars.githubusercontent.com/u/6128107?v=4",
      "htmlUrl": "https://github.com/vuejs",
      "type": "Organization"
    },
    "description": "This is the repo for Vue 2. For Vue 3, go to https://github.com/vuejs/core",
    "htmlUrl": "https://github.com/vuejs/vue",
    "stars": 212629,
    "forks": 33615,
    "openIssues": 640,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "framework",
      "frontend",
      "javascript",
      "vue"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T11:19:03Z",
    "createdAt": "2013-07-29T03:24:51Z",
    "defaultBranch": "main"
  },
  {
    "id": 19415064,
    "name": "computer-science",
    "fullName": "ossu/computer-science",
    "owner": {
      "login": "ossu",
      "avatarUrl": "https://avatars.githubusercontent.com/u/14957346?v=4",
      "htmlUrl": "https://github.com/ossu",
      "type": "Organization"
    },
    "description": "🎓 Path to a free self-taught education in Computer Science!",
    "htmlUrl": "https://github.com/ossu/computer-science",
    "stars": 210263,
    "forks": 26007,
    "openIssues": 29,
    "language": "HTML",
    "languageColor": "#e34c26",
    "topics": [
      "awesome-list",
      "computer-science",
      "courses",
      "curriculum"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:43:59Z",
    "createdAt": "2014-05-04T00:18:39Z",
    "defaultBranch": "master"
  },
  {
    "id": 193215554,
    "name": "n8n",
    "fullName": "n8n-io/n8n",
    "owner": {
      "login": "n8n-io",
      "avatarUrl": "https://avatars.githubusercontent.com/u/45487711?v=4",
      "htmlUrl": "https://github.com/n8n-io",
      "type": "Organization"
    },
    "description": "Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.",
    "htmlUrl": "https://github.com/n8n-io/n8n",
    "stars": 208393,
    "forks": 61213,
    "openIssues": 1193,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "ai",
      "apis",
      "automation",
      "cli",
      "data-flow"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:06:28Z",
    "createdAt": "2019-06-22T09:24:21Z",
    "defaultBranch": "master"
  },
  {
    "id": 808144141,
    "name": "FreeDomain",
    "fullName": "DigitalPlatDev/FreeDomain",
    "owner": {
      "login": "DigitalPlatDev",
      "avatarUrl": "https://avatars.githubusercontent.com/u/126394654?v=4",
      "htmlUrl": "https://github.com/DigitalPlatDev",
      "type": "Organization"
    },
    "description": "Free domain registration and practical DNS learning resources for everyone.",
    "htmlUrl": "https://github.com/DigitalPlatDev/FreeDomain",
    "stars": 205494,
    "forks": 4560,
    "openIssues": 38,
    "language": "Markdown",
    "languageColor": "#083fa1",
    "topics": [
      "digitalplat",
      "dns",
      "dns-tutorial",
      "documentation",
      "domain"
    ],
    "license": "AGPL-3.0",
    "updatedAt": "2026-10-23T16:00:55Z",
    "createdAt": "2024-05-30T13:23:00Z",
    "defaultBranch": "main"
  },
  {
    "id": 45717250,
    "name": "tensorflow",
    "fullName": "tensorflow/tensorflow",
    "owner": {
      "login": "tensorflow",
      "avatarUrl": "https://avatars.githubusercontent.com/u/15658638?v=4",
      "htmlUrl": "https://github.com/tensorflow",
      "type": "Organization"
    },
    "description": "An Open Source Machine Learning Framework for Everyone",
    "htmlUrl": "https://github.com/tensorflow/tensorflow",
    "stars": 201195,
    "forks": 79398,
    "openIssues": 3387,
    "language": "C++",
    "languageColor": "#f34b7d",
    "topics": [
      "deep-learning",
      "deep-neural-networks",
      "distributed",
      "machine-learning",
      "ml"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T16:10:13Z",
    "createdAt": "2015-11-07T01:19:20Z",
    "defaultBranch": "master"
  },
  {
    "id": 307260205,
    "name": "yt-dlp",
    "fullName": "yt-dlp/yt-dlp",
    "owner": {
      "login": "yt-dlp",
      "avatarUrl": "https://avatars.githubusercontent.com/u/79589310?v=4",
      "htmlUrl": "https://github.com/yt-dlp",
      "type": "Organization"
    },
    "description": "A feature-rich command-line audio/video downloader",
    "htmlUrl": "https://github.com/yt-dlp/yt-dlp",
    "stars": 200818,
    "forks": 17521,
    "openIssues": 2717,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "cli",
      "downloader",
      "python",
      "sponsorblock",
      "youtube-dl"
    ],
    "license": "Unlicense",
    "updatedAt": "2026-10-23T16:13:18Z",
    "createdAt": "2020-10-26T04:22:55Z",
    "defaultBranch": "master"
  },
  {
    "id": 126577260,
    "name": "javascript-algorithms",
    "fullName": "trekhleb/javascript-algorithms",
    "owner": {
      "login": "trekhleb",
      "avatarUrl": "https://avatars.githubusercontent.com/u/3000285?v=4",
      "htmlUrl": "https://github.com/trekhleb",
      "type": "User"
    },
    "description": "📝 Algorithms and data structures implemented in JavaScript with explanations and links to further readings",
    "htmlUrl": "https://github.com/trekhleb/javascript-algorithms",
    "stars": 196691,
    "forks": 30989,
    "openIssues": 423,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "algorithm",
      "algorithms",
      "computer-science",
      "data-structures",
      "interview"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:46:05Z",
    "createdAt": "2018-03-24T07:47:04Z",
    "defaultBranch": "master"
  },
  {
    "id": 233472199,
    "name": "Microsoft-Activation-Scripts",
    "fullName": "massgravel/Microsoft-Activation-Scripts",
    "owner": {
      "login": "massgravel",
      "avatarUrl": "https://avatars.githubusercontent.com/u/59795046?v=4",
      "htmlUrl": "https://github.com/massgravel",
      "type": "Organization"
    },
    "description": "Open-source Windows and Office activator featuring HWID, Ohook, TSforge, and Online KMS activation methods, along with advanced troubleshooting.",
    "htmlUrl": "https://github.com/massgravel/Microsoft-Activation-Scripts",
    "stars": 195699,
    "forks": 18547,
    "openIssues": 1,
    "language": "Batchfile",
    "languageColor": "#8b949e",
    "topics": [
      "activator",
      "hwid",
      "kms",
      "kms38",
      "massgrave"
    ],
    "license": "GPL-3.0",
    "updatedAt": "2026-10-23T16:12:05Z",
    "createdAt": "2020-01-12T23:03:34Z",
    "defaultBranch": "master"
  },
  {
    "id": 1197021090,
    "name": "claw-code",
    "fullName": "ultraworkers/claw-code",
    "owner": {
      "login": "ultraworkers",
      "avatarUrl": "https://avatars.githubusercontent.com/u/272961631?v=4",
      "htmlUrl": "https://github.com/ultraworkers",
      "type": "Organization"
    },
    "description": "An agent-managed museum exhibit, built in Rust with Gajae-Code / LazyCodex — developed and maintained with no human intervention.",
    "htmlUrl": "https://github.com/ultraworkers/claw-code",
    "stars": 195070,
    "forks": 107810,
    "openIssues": 1,
    "language": "Rust",
    "languageColor": "#dea584",
    "topics": [],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:03:58Z",
    "createdAt": "2026-03-31T08:58:08Z",
    "defaultBranch": "main"
  },
  {
    "id": 787076358,
    "name": "firecrawl",
    "fullName": "firecrawl/firecrawl",
    "owner": {
      "login": "firecrawl",
      "avatarUrl": "https://avatars.githubusercontent.com/u/135057108?v=4",
      "htmlUrl": "https://github.com/firecrawl",
      "type": "Organization"
    },
    "description": "Supercharge your AI agents with data from the web and beyond. Building the library for superintelligence. 🔥",
    "htmlUrl": "https://github.com/firecrawl/firecrawl",
    "stars": 194564,
    "forks": 10269,
    "openIssues": 660,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "ai",
      "ai-agents",
      "ai-crawler",
      "ai-scraping",
      "ai-search"
    ],
    "license": "AGPL-3.0",
    "updatedAt": "2026-10-23T16:10:38Z",
    "createdAt": "2024-04-15T21:02:29Z",
    "defaultBranch": "main"
  },
  {
    "id": 41881900,
    "name": "vscode",
    "fullName": "microsoft/vscode",
    "owner": {
      "login": "microsoft",
      "avatarUrl": "https://avatars.githubusercontent.com/u/6154722?v=4",
      "htmlUrl": "https://github.com/microsoft",
      "type": "Organization"
    },
    "description": "Visual Studio Code",
    "htmlUrl": "https://github.com/microsoft/vscode",
    "stars": 194243,
    "forks": 45574,
    "openIssues": 22089,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "editor",
      "electron",
      "microsoft",
      "typescript",
      "visual-studio-code"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:01:57Z",
    "createdAt": "2015-09-03T20:23:38Z",
    "defaultBranch": "main"
  },
  {
    "id": 888092115,
    "name": "markitdown",
    "fullName": "microsoft/markitdown",
    "owner": {
      "login": "microsoft",
      "avatarUrl": "https://avatars.githubusercontent.com/u/6154722?v=4",
      "htmlUrl": "https://github.com/microsoft",
      "type": "Organization"
    },
    "description": "Python tool for converting files and office documents to Markdown.",
    "htmlUrl": "https://github.com/microsoft/markitdown",
    "stars": 191787,
    "forks": 14298,
    "openIssues": 740,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "autogen",
      "autogen-extension",
      "langchain",
      "markdown",
      "microsoft-office"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:06:19Z",
    "createdAt": "2024-11-13T19:56:40Z",
    "defaultBranch": "main"
  },
  {
    "id": 291137,
    "name": "ohmyzsh",
    "fullName": "ohmyzsh/ohmyzsh",
    "owner": {
      "login": "ohmyzsh",
      "avatarUrl": "https://avatars.githubusercontent.com/u/22552083?v=4",
      "htmlUrl": "https://github.com/ohmyzsh",
      "type": "Organization"
    },
    "description": "🙃   A delightful community-driven (with 2,500+ contributors) framework for managing your zsh configuration. Includes 300+ optional plugins (rails, git, macOS, hub, docker, homebrew, node, php, python, etc), 140+ themes to spice up your morning, and an auto-update tool that makes it easy to keep up with the latest updates from the community.",
    "htmlUrl": "https://github.com/ohmyzsh/ohmyzsh",
    "stars": 190141,
    "forks": 29373,
    "openIssues": 291,
    "language": "Shell",
    "languageColor": "#89e051",
    "topics": [
      "cli",
      "cli-app",
      "oh-my-zsh",
      "oh-my-zsh-plugin",
      "oh-my-zsh-theme"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T14:39:57Z",
    "createdAt": "2009-08-28T18:15:37Z",
    "defaultBranch": "master"
  },
  {
    "id": 21540759,
    "name": "awesome-go",
    "fullName": "avelino/awesome-go",
    "owner": {
      "login": "avelino",
      "avatarUrl": "https://avatars.githubusercontent.com/u/31996?v=4",
      "htmlUrl": "https://github.com/avelino",
      "type": "User"
    },
    "description": "A curated list of awesome Go frameworks, libraries and software",
    "htmlUrl": "https://github.com/avelino/awesome-go",
    "stars": 189938,
    "forks": 13652,
    "openIssues": 85,
    "language": "Go",
    "languageColor": "#00ADD8",
    "topics": [
      "awesome",
      "awesome-list",
      "go",
      "golang",
      "golang-library"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:51:02Z",
    "createdAt": "2014-07-06T13:42:15Z",
    "defaultBranch": "main"
  },
  {
    "id": 614765452,
    "name": "AutoGPT",
    "fullName": "Significant-Gravitas/AutoGPT",
    "owner": {
      "login": "Significant-Gravitas",
      "avatarUrl": "https://avatars.githubusercontent.com/u/130738209?v=4",
      "htmlUrl": "https://github.com/Significant-Gravitas",
      "type": "Organization"
    },
    "description": "AutoGPT is the vision of accessible AI for everyone, to use and to build on. Our mission is to provide the tools, so that you can focus on what matters.",
    "htmlUrl": "https://github.com/Significant-Gravitas/AutoGPT",
    "stars": 187718,
    "forks": 45903,
    "openIssues": 707,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "agentic-ai",
      "agents",
      "ai",
      "artificial-intelligence",
      "autonomous-agents"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:11:12Z",
    "createdAt": "2023-03-16T09:21:07Z",
    "defaultBranch": "master"
  },
  {
    "id": 123458551,
    "name": "Python-100-Days",
    "fullName": "jackfrued/Python-100-Days",
    "owner": {
      "login": "jackfrued",
      "avatarUrl": "https://avatars.githubusercontent.com/u/7474657?v=4",
      "htmlUrl": "https://github.com/jackfrued",
      "type": "User"
    },
    "description": "Python - 100天从新手到大师",
    "htmlUrl": "https://github.com/jackfrued/Python-100-Days",
    "stars": 187394,
    "forks": 55756,
    "openIssues": 721,
    "language": "Jupyter Notebook",
    "languageColor": "#8b949e",
    "topics": [],
    "license": "None",
    "updatedAt": "2026-10-23T15:44:27Z",
    "createdAt": "2018-03-01T16:05:52Z",
    "defaultBranch": "master"
  },
  {
    "id": 121395510,
    "name": "CS-Notes",
    "fullName": "CyC2018/CS-Notes",
    "owner": {
      "login": "CyC2018",
      "avatarUrl": "https://avatars.githubusercontent.com/u/36260787?v=4",
      "htmlUrl": "https://github.com/CyC2018",
      "type": "User"
    },
    "description": ":books: 技术面试必备基础知识、Leetcode、计算机操作系统、计算机网络、系统设计",
    "htmlUrl": "https://github.com/CyC2018/CS-Notes",
    "stars": 186317,
    "forks": 50667,
    "openIssues": 200,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "algorithm",
      "computer-science",
      "cpp",
      "interview",
      "java"
    ],
    "license": "None",
    "updatedAt": "2026-10-23T15:50:36Z",
    "createdAt": "2018-02-13T14:56:24Z",
    "defaultBranch": "master"
  },
  {
    "id": 14440270,
    "name": "You-Dont-Know-JS",
    "fullName": "getify/You-Dont-Know-JS",
    "owner": {
      "login": "getify",
      "avatarUrl": "https://avatars.githubusercontent.com/u/150330?v=4",
      "htmlUrl": "https://github.com/getify",
      "type": "User"
    },
    "description": "A book series (2 published editions) on the JS language.",
    "htmlUrl": "https://github.com/getify/You-Dont-Know-JS",
    "stars": 184833,
    "forks": 33350,
    "openIssues": 2,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "async",
      "book",
      "book-series",
      "closures",
      "education"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T14:10:00Z",
    "createdAt": "2013-11-16T02:37:24Z",
    "defaultBranch": "2nd-ed"
  },
  {
    "id": 658928958,
    "name": "ollama",
    "fullName": "ollama/ollama",
    "owner": {
      "login": "ollama",
      "avatarUrl": "https://avatars.githubusercontent.com/u/151674099?v=4",
      "htmlUrl": "https://github.com/ollama",
      "type": "Organization"
    },
    "description": "Get up and running with Kimi, GLM, MiniMax, DeepSeek, gpt-oss, Qwen, Gemma and other models.",
    "htmlUrl": "https://github.com/ollama/ollama",
    "stars": 184448,
    "forks": 18496,
    "openIssues": 4401,
    "language": "Go",
    "languageColor": "#00ADD8",
    "topics": [
      "deepseek",
      "gemma",
      "gemma3",
      "glm",
      "go"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:12:50Z",
    "createdAt": "2023-06-26T19:39:32Z",
    "defaultBranch": "main"
  },
  {
    "id": 58028038,
    "name": "HelloGitHub",
    "fullName": "521xueweihan/HelloGitHub",
    "owner": {
      "login": "521xueweihan",
      "avatarUrl": "https://avatars.githubusercontent.com/u/8255800?v=4",
      "htmlUrl": "https://github.com/521xueweihan",
      "type": "User"
    },
    "description": ":octocat: 分享 GitHub 上有趣、入门级的开源项目。Share interesting, entry-level open source projects on GitHub.",
    "htmlUrl": "https://github.com/521xueweihan/HelloGitHub",
    "stars": 183912,
    "forks": 13071,
    "openIssues": 1097,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "awesome",
      "github",
      "hellogithub",
      "python"
    ],
    "license": "None",
    "updatedAt": "2026-10-23T16:08:47Z",
    "createdAt": "2016-05-04T06:24:11Z",
    "defaultBranch": "master"
  },
  {
    "id": 1061953414,
    "name": "skills",
    "fullName": "anthropics/skills",
    "owner": {
      "login": "anthropics",
      "avatarUrl": "https://avatars.githubusercontent.com/u/76263028?v=4",
      "htmlUrl": "https://github.com/anthropics",
      "type": "Organization"
    },
    "description": "Public repository for Agent Skills",
    "htmlUrl": "https://github.com/anthropics/skills",
    "stars": 183220,
    "forks": 21694,
    "openIssues": 1430,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "agent-skills"
    ],
    "license": "None",
    "updatedAt": "2026-10-23T16:09:08Z",
    "createdAt": "2025-09-22T15:53:31Z",
    "defaultBranch": "main"
  },
  {
    "id": 31792824,
    "name": "flutter",
    "fullName": "flutter/flutter",
    "owner": {
      "login": "flutter",
      "avatarUrl": "https://avatars.githubusercontent.com/u/14101776?v=4",
      "htmlUrl": "https://github.com/flutter",
      "type": "Organization"
    },
    "description": "Flutter makes it easy and fast to build beautiful apps for mobile and beyond",
    "htmlUrl": "https://github.com/flutter/flutter",
    "stars": 180339,
    "forks": 34028,
    "openIssues": 13465,
    "language": "Dart",
    "languageColor": "#00B4AB",
    "topics": [
      "android",
      "app-framework",
      "cross-platform",
      "dart",
      "dart-platform"
    ],
    "license": "BSD-3-Clause",
    "updatedAt": "2026-10-23T15:53:07Z",
    "createdAt": "2015-03-06T22:54:58Z",
    "defaultBranch": "master"
  },
  {
    "id": 1062897,
    "name": "gitignore",
    "fullName": "github/gitignore",
    "owner": {
      "login": "github",
      "avatarUrl": "https://avatars.githubusercontent.com/u/9919?v=4",
      "htmlUrl": "https://github.com/github",
      "type": "Organization"
    },
    "description": "A collection of useful .gitignore templates",
    "htmlUrl": "https://github.com/github/gitignore",
    "stars": 176039,
    "forks": 82083,
    "openIssues": 70,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "git",
      "gitignore"
    ],
    "license": "CC0-1.0",
    "updatedAt": "2026-10-23T15:57:35Z",
    "createdAt": "2010-11-08T20:17:14Z",
    "defaultBranch": "main"
  },
  {
    "id": 2126244,
    "name": "bootstrap",
    "fullName": "twbs/bootstrap",
    "owner": {
      "login": "twbs",
      "avatarUrl": "https://avatars.githubusercontent.com/u/2918581?v=4",
      "htmlUrl": "https://github.com/twbs",
      "type": "Organization"
    },
    "description": "The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.",
    "htmlUrl": "https://github.com/twbs/bootstrap",
    "stars": 175008,
    "forks": 78523,
    "openIssues": 286,
    "language": "MDX",
    "languageColor": "#8b949e",
    "topics": [
      "bootstrap",
      "css",
      "css-framework",
      "html",
      "javascript"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T10:15:18Z",
    "createdAt": "2011-07-29T21:19:00Z",
    "defaultBranch": "main"
  },
  {
    "id": 1266797999,
    "name": "ponytail",
    "fullName": "DietrichGebert/ponytail",
    "owner": {
      "login": "DietrichGebert",
      "avatarUrl": "https://avatars.githubusercontent.com/u/137048761?v=4",
      "htmlUrl": "https://github.com/DietrichGebert",
      "type": "User"
    },
    "description": "Makes your AI agent think like the laziest senior dev in the room. The best code is the code you never wrote.",
    "htmlUrl": "https://github.com/DietrichGebert/ponytail",
    "stars": 174559,
    "forks": 9507,
    "openIssues": 99,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "agent-skills",
      "ai-agents",
      "claude",
      "claude-code",
      "claude-code-plugin"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:13:19Z",
    "createdAt": "2026-06-12T00:52:37Z",
    "defaultBranch": "main"
  },
  {
    "id": 574523116,
    "name": "prompts.chat",
    "fullName": "f/prompts.chat",
    "owner": {
      "login": "f",
      "avatarUrl": "https://avatars.githubusercontent.com/u/196477?v=4",
      "htmlUrl": "https://github.com/f",
      "type": "User"
    },
    "description": "f.k.a. Awesome ChatGPT Prompts. Share, discover, and collect prompts from the community. Free and open source — self-host for your organization with complete privacy.",
    "htmlUrl": "https://github.com/f/prompts.chat",
    "stars": 174188,
    "forks": 22256,
    "openIssues": 93,
    "language": "HTML",
    "languageColor": "#e34c26",
    "topics": [
      "ai",
      "artificial-intelligence",
      "awesome-list",
      "chatgpt",
      "chatgpt-prompts"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:12:17Z",
    "createdAt": "2022-12-05T13:54:13Z",
    "defaultBranch": "main"
  },
  {
    "id": 155220641,
    "name": "transformers",
    "fullName": "huggingface/transformers",
    "owner": {
      "login": "huggingface",
      "avatarUrl": "https://avatars.githubusercontent.com/u/25720743?v=4",
      "htmlUrl": "https://github.com/huggingface",
      "type": "Organization"
    },
    "description": "🤗 Transformers: the model-definition framework for state-of-the-art machine learning models in text, vision, audio, and multimodal models, for both inference and training. ",
    "htmlUrl": "https://github.com/huggingface/transformers",
    "stars": 168033,
    "forks": 34953,
    "openIssues": 984,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "audio",
      "deep-learning",
      "deepseek",
      "gemma",
      "glm"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T15:40:01Z",
    "createdAt": "2018-10-29T13:56:00Z",
    "defaultBranch": "main"
  },
  {
    "id": 527591471,
    "name": "stable-diffusion-webui",
    "fullName": "AUTOMATIC1111/stable-diffusion-webui",
    "owner": {
      "login": "AUTOMATIC1111",
      "avatarUrl": "https://avatars.githubusercontent.com/u/20920490?v=4",
      "htmlUrl": "https://github.com/AUTOMATIC1111",
      "type": "User"
    },
    "description": "Stable Diffusion web UI",
    "htmlUrl": "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    "stars": 165123,
    "forks": 33273,
    "openIssues": 2511,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai",
      "ai-art",
      "deep-learning",
      "diffusion",
      "gradio"
    ],
    "license": "AGPL-3.0",
    "updatedAt": "2026-10-23T16:04:25Z",
    "createdAt": "2022-08-22T14:05:26Z",
    "defaultBranch": "master"
  },
  {
    "id": 1075372545,
    "name": "agency-agents",
    "fullName": "msitarzewski/agency-agents",
    "owner": {
      "login": "msitarzewski",
      "avatarUrl": "https://avatars.githubusercontent.com/u/1972242?v=4",
      "htmlUrl": "https://github.com/msitarzewski",
      "type": "User"
    },
    "description": "A complete AI agency at your fingertips - From frontend wizards to Reddit community ninjas, from whimsy injectors to reality checkers. Each agent is a specialized expert with personality, processes, and proven deliverables.",
    "htmlUrl": "https://github.com/msitarzewski/agency-agents",
    "stars": 163452,
    "forks": 26380,
    "openIssues": 178,
    "language": "Shell",
    "languageColor": "#89e051",
    "topics": [],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:00:56Z",
    "createdAt": "2025-10-13T12:12:29Z",
    "defaultBranch": "main"
  },
  {
    "id": 35955666,
    "name": "the-art-of-command-line",
    "fullName": "jlevy/the-art-of-command-line",
    "owner": {
      "login": "jlevy",
      "avatarUrl": "https://avatars.githubusercontent.com/u/2058167?v=4",
      "htmlUrl": "https://github.com/jlevy",
      "type": "User"
    },
    "description": "Master the command line, in one page",
    "htmlUrl": "https://github.com/jlevy/the-art-of-command-line",
    "stars": 162583,
    "forks": 14831,
    "openIssues": 256,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "bash",
      "documentation",
      "linux",
      "macos",
      "unix"
    ],
    "license": "None",
    "updatedAt": "2026-10-23T13:52:36Z",
    "createdAt": "2015-05-20T15:11:03Z",
    "defaultBranch": "master"
  },
  {
    "id": 626805178,
    "name": "dify",
    "fullName": "langgenius/dify",
    "owner": {
      "login": "langgenius",
      "avatarUrl": "https://avatars.githubusercontent.com/u/127165244?v=4",
      "htmlUrl": "https://github.com/langgenius",
      "type": "Organization"
    },
    "description": "Build Agentic workflows, RAG pipelines, with rich AI model and tool support on one collaborative workspace. Deploy on cloud, VPC, or self-hosted, so teams move from prototype to production without rebuilding the stack.",
    "htmlUrl": "https://github.com/langgenius/dify",
    "stars": 159357,
    "forks": 25176,
    "openIssues": 1155,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "agent",
      "agentic-ai",
      "agentic-framework",
      "agentic-workflow",
      "ai"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:09:22Z",
    "createdAt": "2023-04-12T07:40:24Z",
    "defaultBranch": "main"
  },
  {
    "id": 132464395,
    "name": "JavaGuide",
    "fullName": "Snailclimb/JavaGuide",
    "owner": {
      "login": "Snailclimb",
      "avatarUrl": "https://avatars.githubusercontent.com/u/29880145?v=4",
      "htmlUrl": "https://github.com/Snailclimb",
      "type": "User"
    },
    "description": "Java 面试 & 后端通用面试指南，覆盖计算机基础、数据库、分布式、高并发、系统设计与 AI 应用开发",
    "htmlUrl": "https://github.com/Snailclimb/JavaGuide",
    "stars": 159221,
    "forks": 46124,
    "openIssues": 18,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "agent",
      "ai",
      "context-engineering",
      "deepseek",
      "interview"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T15:46:04Z",
    "createdAt": "2018-05-07T13:27:00Z",
    "defaultBranch": "main"
  },
  {
    "id": 701547123,
    "name": "open-webui",
    "fullName": "open-webui/open-webui",
    "owner": {
      "login": "open-webui",
      "avatarUrl": "https://avatars.githubusercontent.com/u/158137808?v=4",
      "htmlUrl": "https://github.com/open-webui",
      "type": "Organization"
    },
    "description": "User-friendly AI Interface (Supports Ollama, OpenAI API, ...)",
    "htmlUrl": "https://github.com/open-webui/open-webui",
    "stars": 156566,
    "forks": 22783,
    "openIssues": 221,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai",
      "llm",
      "llm-ui",
      "llm-webui",
      "llms"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:01:19Z",
    "createdAt": "2023-10-06T22:08:27Z",
    "defaultBranch": "main"
  },
  {
    "id": 599320067,
    "name": "langflow",
    "fullName": "langflow-ai/langflow",
    "owner": {
      "login": "langflow-ai",
      "avatarUrl": "https://avatars.githubusercontent.com/u/85702467?v=4",
      "htmlUrl": "https://github.com/langflow-ai",
      "type": "Organization"
    },
    "description": "Langflow is a powerful tool for building and deploying AI-powered agents and workflows.",
    "htmlUrl": "https://github.com/langflow-ai/langflow",
    "stars": 155969,
    "forks": 10242,
    "openIssues": 1218,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "agents",
      "chatgpt",
      "generative-ai",
      "large-language-models",
      "multiagent"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:10:09Z",
    "createdAt": "2023-02-08T22:28:03Z",
    "defaultBranch": "main"
  },
  {
    "id": 721767116,
    "name": "clash-verge-rev",
    "fullName": "clash-verge-rev/clash-verge-rev",
    "owner": {
      "login": "clash-verge-rev",
      "avatarUrl": "https://avatars.githubusercontent.com/u/152534467?v=4",
      "htmlUrl": "https://github.com/clash-verge-rev",
      "type": "Organization"
    },
    "description": "A modern GUI client based on Tauri, designed to run in Windows, macOS and Linux for tailored proxy experience",
    "htmlUrl": "https://github.com/clash-verge-rev/clash-verge-rev",
    "stars": 153399,
    "forks": 11003,
    "openIssues": 553,
    "language": "Rust",
    "languageColor": "#dea584",
    "topics": [
      "clash",
      "clash-meta",
      "clash-verge",
      "linux",
      "mac"
    ],
    "license": "GPL-3.0",
    "updatedAt": "2026-10-23T16:11:45Z",
    "createdAt": "2023-11-21T18:24:03Z",
    "defaultBranch": "dev"
  },
  {
    "id": 937253475,
    "name": "claude-code",
    "fullName": "anthropics/claude-code",
    "owner": {
      "login": "anthropics",
      "avatarUrl": "https://avatars.githubusercontent.com/u/76263028?v=4",
      "htmlUrl": "https://github.com/anthropics",
      "type": "Organization"
    },
    "description": "Claude Code is an agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows - all through natural language commands.",
    "htmlUrl": "https://github.com/anthropics/claude-code",
    "stars": 153122,
    "forks": 26805,
    "openIssues": 15587,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [],
    "license": "None",
    "updatedAt": "2026-10-23T16:09:54Z",
    "createdAt": "2025-02-22T17:41:21Z",
    "defaultBranch": "main"
  },
  {
    "id": 111583593,
    "name": "scrcpy",
    "fullName": "Genymobile/scrcpy",
    "owner": {
      "login": "Genymobile",
      "avatarUrl": "https://avatars.githubusercontent.com/u/3427627?v=4",
      "htmlUrl": "https://github.com/Genymobile",
      "type": "Organization"
    },
    "description": "Display and control your Android device",
    "htmlUrl": "https://github.com/Genymobile/scrcpy",
    "stars": 152956,
    "forks": 14018,
    "openIssues": 2934,
    "language": "C",
    "languageColor": "#555555",
    "topics": [
      "android",
      "c",
      "ffmpeg",
      "genyteam-system",
      "libav"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T15:59:21Z",
    "createdAt": "2017-11-21T18:00:27Z",
    "defaultBranch": "master"
  },
  {
    "id": 552661142,
    "name": "langchain",
    "fullName": "langchain-ai/langchain",
    "owner": {
      "login": "langchain-ai",
      "avatarUrl": "https://avatars.githubusercontent.com/u/126733545?v=4",
      "htmlUrl": "https://github.com/langchain-ai",
      "type": "Organization"
    },
    "description": "The agent engineering platform.",
    "htmlUrl": "https://github.com/langchain-ai/langchain",
    "stars": 148321,
    "forks": 24894,
    "openIssues": 665,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "agents",
      "ai",
      "ai-agents",
      "anthropic",
      "chatgpt"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:10:50Z",
    "createdAt": "2022-10-17T02:58:36Z",
    "defaultBranch": "master"
  },
  {
    "id": 6498492,
    "name": "javascript",
    "fullName": "airbnb/javascript",
    "owner": {
      "login": "airbnb",
      "avatarUrl": "https://avatars.githubusercontent.com/u/698437?v=4",
      "htmlUrl": "https://github.com/airbnb",
      "type": "Organization"
    },
    "description": "JavaScript Style Guide",
    "htmlUrl": "https://github.com/airbnb/javascript",
    "stars": 148048,
    "forks": 26531,
    "openIssues": 169,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "arrow-functions",
      "es2015",
      "es2016",
      "es2017",
      "es2018"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T13:58:36Z",
    "createdAt": "2012-11-01T23:13:50Z",
    "defaultBranch": "master"
  },
  {
    "id": 1031912724,
    "name": "cc-switch",
    "fullName": "farion1231/cc-switch",
    "owner": {
      "login": "farion1231",
      "avatarUrl": "https://avatars.githubusercontent.com/u/44939412?v=4",
      "htmlUrl": "https://github.com/farion1231",
      "type": "User"
    },
    "description": "A cross-platform desktop All-in-One assistant for Claude Code, Codex, OpenCode, OpenClaw, Grok Build & Hermes Agent. Only official website: ccswitch.io",
    "htmlUrl": "https://github.com/farion1231/cc-switch",
    "stars": 148002,
    "forks": 9742,
    "openIssues": 1092,
    "language": "Rust",
    "languageColor": "#dea584",
    "topics": [
      "ai-tools",
      "claude-code",
      "codex",
      "desktop-app",
      "grok"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:09:49Z",
    "createdAt": "2025-08-04T14:16:16Z",
    "defaultBranch": "main"
  },
  {
    "id": 943398999,
    "name": "system-prompts-and-models-of-ai-tools",
    "fullName": "x1xhlol/system-prompts-and-models-of-ai-tools",
    "owner": {
      "login": "x1xhlol",
      "avatarUrl": "https://avatars.githubusercontent.com/u/185671340?v=4",
      "htmlUrl": "https://github.com/x1xhlol",
      "type": "User"
    },
    "description": "FULL Augment Code, Claude Code, Cluely, CodeBuddy, Comet, Cursor, Devin AI, Junie, Kiro, Leap.new, Lovable, Manus, NotionAI, Orchids.app, Perplexity, Poke, Qoder, Replit, Same.dev, Trae, Traycer AI, VSCode Agent, Warp.dev, Windsurf, Xcode, Z.ai Code, Dia & v0. (And other Open Sourced) System Prompts, Internal Tools & AI Models",
    "htmlUrl": "https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools",
    "stars": 144210,
    "forks": 34701,
    "openIssues": 162,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "ai",
      "bolt",
      "cluely",
      "copilot",
      "cursor"
    ],
    "license": "GPL-3.0",
    "updatedAt": "2026-10-23T14:17:58Z",
    "createdAt": "2025-03-05T16:38:29Z",
    "defaultBranch": "main"
  },
  {
    "id": 70107786,
    "name": "next.js",
    "fullName": "vercel/next.js",
    "owner": {
      "login": "vercel",
      "avatarUrl": "https://avatars.githubusercontent.com/u/14985020?v=4",
      "htmlUrl": "https://github.com/vercel",
      "type": "Organization"
    },
    "description": "The React Framework",
    "htmlUrl": "https://github.com/vercel/next.js",
    "stars": 143205,
    "forks": 34885,
    "openIssues": 3756,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "blog",
      "browser",
      "compiler",
      "components",
      "hybrid"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:53:08Z",
    "createdAt": "2016-10-05T23:32:51Z",
    "defaultBranch": "canary"
  },
  {
    "id": 62607227,
    "name": "tech-interview-handbook",
    "fullName": "yangshun/tech-interview-handbook",
    "owner": {
      "login": "yangshun",
      "avatarUrl": "https://avatars.githubusercontent.com/u/1315101?v=4",
      "htmlUrl": "https://github.com/yangshun",
      "type": "User"
    },
    "description": "Curated coding interview preparation materials for busy software engineers",
    "htmlUrl": "https://github.com/yangshun/tech-interview-handbook",
    "stars": 143124,
    "forks": 16863,
    "openIssues": 37,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "algorithm",
      "algorithm-interview",
      "algorithm-interview-questions",
      "algorithms",
      "behavioral-interviews"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:05:28Z",
    "createdAt": "2016-07-05T05:00:48Z",
    "defaultBranch": "main"
  },
  {
    "id": 793375104,
    "name": "awesome-llm-apps",
    "fullName": "Shubhamsaboo/awesome-llm-apps",
    "owner": {
      "login": "Shubhamsaboo",
      "avatarUrl": "https://avatars.githubusercontent.com/u/31396011?v=4",
      "htmlUrl": "https://github.com/Shubhamsaboo",
      "type": "User"
    },
    "description": "100+ AI Agents, Agent Skills and RAG Apps - Free and Open Source.",
    "htmlUrl": "https://github.com/Shubhamsaboo/awesome-llm-apps",
    "stars": 142797,
    "forks": 20993,
    "openIssues": 22,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "agents",
      "llms",
      "python",
      "rag"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T16:01:00Z",
    "createdAt": "2024-04-29T05:30:25Z",
    "defaultBranch": "main"
  },
  {
    "id": 1042367133,
    "name": "spec-kit",
    "fullName": "github/spec-kit",
    "owner": {
      "login": "github",
      "avatarUrl": "https://avatars.githubusercontent.com/u/9919?v=4",
      "htmlUrl": "https://github.com/github",
      "type": "Organization"
    },
    "description": "💫 Toolkit to help you get started with SDD or any other process!",
    "htmlUrl": "https://github.com/github/spec-kit",
    "stars": 142549,
    "forks": 12765,
    "openIssues": 181,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai",
      "copilot",
      "development",
      "engineering",
      "prd"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:05:40Z",
    "createdAt": "2025-08-21T22:54:31Z",
    "defaultBranch": "main"
  },
  {
    "id": 589831718,
    "name": "ComfyUI",
    "fullName": "Comfy-Org/ComfyUI",
    "owner": {
      "login": "Comfy-Org",
      "avatarUrl": "https://avatars.githubusercontent.com/u/166579949?v=4",
      "htmlUrl": "https://github.com/Comfy-Org",
      "type": "Organization"
    },
    "description": "The most powerful and modular diffusion model GUI, api and backend with a graph/nodes interface. The fastest local inference engine in the world.",
    "htmlUrl": "https://github.com/Comfy-Org/ComfyUI",
    "stars": 142270,
    "forks": 16775,
    "openIssues": 5336,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai",
      "comfy",
      "comfyui",
      "python",
      "pytorch"
    ],
    "license": "GPL-3.0",
    "updatedAt": "2026-10-23T16:10:01Z",
    "createdAt": "2023-01-17T03:15:56Z",
    "defaultBranch": "master"
  },
  {
    "id": 157616880,
    "name": "iptv",
    "fullName": "iptv-org/iptv",
    "owner": {
      "login": "iptv-org",
      "avatarUrl": "https://avatars.githubusercontent.com/u/55937028?v=4",
      "htmlUrl": "https://github.com/iptv-org",
      "type": "Organization"
    },
    "description": "Collection of publicly available IPTV channels from all over the world",
    "htmlUrl": "https://github.com/iptv-org/iptv",
    "stars": 142094,
    "forks": 8353,
    "openIssues": 72,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "iptv",
      "m3u",
      "playlist",
      "streams",
      "tv"
    ],
    "license": "Unlicense",
    "updatedAt": "2026-10-23T16:09:21Z",
    "createdAt": "2018-11-14T22:00:57Z",
    "defaultBranch": "master"
  },
  {
    "id": 1039520,
    "name": "youtube-dl",
    "fullName": "ytdl-org/youtube-dl",
    "owner": {
      "login": "ytdl-org",
      "avatarUrl": "https://avatars.githubusercontent.com/u/48381040?v=4",
      "htmlUrl": "https://github.com/ytdl-org",
      "type": "Organization"
    },
    "description": "Command-line program to download videos from YouTube.com and other video sites",
    "htmlUrl": "https://github.com/ytdl-org/youtube-dl",
    "stars": 141376,
    "forks": 10660,
    "openIssues": 4123,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [],
    "license": "Unlicense",
    "updatedAt": "2026-10-23T14:53:59Z",
    "createdAt": "2010-10-31T14:35:07Z",
    "defaultBranch": "master"
  },
  {
    "id": 32484381,
    "name": "free-for-dev",
    "fullName": "ripienaar/free-for-dev",
    "owner": {
      "login": "ripienaar",
      "avatarUrl": "https://avatars.githubusercontent.com/u/82342?v=4",
      "htmlUrl": "https://github.com/ripienaar",
      "type": "User"
    },
    "description": "A list of SaaS, PaaS and IaaS offerings that have free tiers of interest to devops and infradev",
    "htmlUrl": "https://github.com/ripienaar/free-for-dev",
    "stars": 139955,
    "forks": 14844,
    "openIssues": 12,
    "language": "HTML",
    "languageColor": "#e34c26",
    "topics": [
      "awesome-list",
      "free-for-developers"
    ],
    "license": "None",
    "updatedAt": "2026-10-23T15:55:25Z",
    "createdAt": "2015-03-18T21:06:26Z",
    "defaultBranch": "master"
  },
  {
    "id": 184456251,
    "name": "PowerToys",
    "fullName": "microsoft/PowerToys",
    "owner": {
      "login": "microsoft",
      "avatarUrl": "https://avatars.githubusercontent.com/u/6154722?v=4",
      "htmlUrl": "https://github.com/microsoft",
      "type": "Organization"
    },
    "description": "Microsoft PowerToys is a collection of utilities that supercharge productivity and customization on Windows",
    "htmlUrl": "https://github.com/microsoft/PowerToys",
    "stars": 139649,
    "forks": 8620,
    "openIssues": 7843,
    "language": "C",
    "languageColor": "#555555",
    "topics": [
      "advanced-paste",
      "color-picker",
      "command-palette",
      "desktop",
      "fancyzones"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:11:19Z",
    "createdAt": "2019-05-01T17:44:02Z",
    "defaultBranch": "main"
  },
  {
    "id": 23096959,
    "name": "go",
    "fullName": "golang/go",
    "owner": {
      "login": "golang",
      "avatarUrl": "https://avatars.githubusercontent.com/u/4314092?v=4",
      "htmlUrl": "https://github.com/golang",
      "type": "Organization"
    },
    "description": "The Go programming language",
    "htmlUrl": "https://github.com/golang/go",
    "stars": 139493,
    "forks": 22306,
    "openIssues": 10416,
    "language": "Go",
    "languageColor": "#00ADD8",
    "topics": [
      "go",
      "golang",
      "language",
      "programming-language"
    ],
    "license": "BSD-3-Clause",
    "updatedAt": "2026-10-23T15:46:37Z",
    "createdAt": "2014-08-19T04:33:40Z",
    "defaultBranch": "master"
  },
  {
    "id": 1106996539,
    "name": "ui-ux-pro-max-skill",
    "fullName": "nextlevelbuilder/ui-ux-pro-max-skill",
    "owner": {
      "login": "nextlevelbuilder",
      "avatarUrl": "https://avatars.githubusercontent.com/u/246974152?v=4",
      "htmlUrl": "https://github.com/nextlevelbuilder",
      "type": "Organization"
    },
    "description": "An AI skill that provides design intelligence for building professional UI/UX across multiple platforms.",
    "htmlUrl": "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    "stars": 139313,
    "forks": 14755,
    "openIssues": 88,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai-skills",
      "antigravity",
      "claude",
      "claude-code",
      "codex"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:11:00Z",
    "createdAt": "2025-11-30T11:36:31Z",
    "defaultBranch": "main"
  },
  {
    "id": 1179264259,
    "name": "gstack",
    "fullName": "garrytan/gstack",
    "owner": {
      "login": "garrytan",
      "avatarUrl": "https://avatars.githubusercontent.com/u/19957?v=4",
      "htmlUrl": "https://github.com/garrytan",
      "type": "User"
    },
    "description": "Use Garry Tan's exact Claude Code setup: 23 opinionated tools that serve as CEO, Designer, Eng Manager, Release Manager, Doc Engineer, and QA",
    "htmlUrl": "https://github.com/garrytan/gstack",
    "stars": 137365,
    "forks": 20362,
    "openIssues": 82,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:01:37Z",
    "createdAt": "2026-03-11T21:22:45Z",
    "defaultBranch": "main"
  },
  {
    "id": 241576270,
    "name": "fucking-algorithm",
    "fullName": "labuladong/fucking-algorithm",
    "owner": {
      "login": "labuladong",
      "avatarUrl": "https://avatars.githubusercontent.com/u/37220920?v=4",
      "htmlUrl": "https://github.com/labuladong",
      "type": "User"
    },
    "description": "Crack LeetCode, not only how, but also why. ",
    "htmlUrl": "https://github.com/labuladong/fucking-algorithm",
    "stars": 135954,
    "forks": 23527,
    "openIssues": 0,
    "language": "Markdown",
    "languageColor": "#083fa1",
    "topics": [
      "algorithms",
      "computer-science",
      "data-structures",
      "dynamic-programming",
      "dynamic-programming-algorithm"
    ],
    "license": "None",
    "updatedAt": "2026-10-23T15:52:17Z",
    "createdAt": "2020-02-19T09:01:23Z",
    "defaultBranch": "master"
  },
  {
    "id": 770153867,
    "name": "MoneyPrinterTurbo",
    "fullName": "harry0703/MoneyPrinterTurbo",
    "owner": {
      "login": "harry0703",
      "avatarUrl": "https://avatars.githubusercontent.com/u/4928832?v=4",
      "htmlUrl": "https://github.com/harry0703",
      "type": "User"
    },
    "description": "利用 AI 大模型和自动化工作流，根据主题或关键词一键生成高清短视频。Generate HD short videos from a topic or keyword with an automated AI workflow.",
    "htmlUrl": "https://github.com/harry0703/MoneyPrinterTurbo",
    "stars": 134480,
    "forks": 21276,
    "openIssues": 78,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai-video-generator",
      "content-creation",
      "ffmpeg",
      "instagram-reels",
      "llm"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:08:05Z",
    "createdAt": "2024-03-11T02:57:34Z",
    "defaultBranch": "main"
  },
  {
    "id": 231283452,
    "name": "excalidraw",
    "fullName": "excalidraw/excalidraw",
    "owner": {
      "login": "excalidraw",
      "avatarUrl": "https://avatars.githubusercontent.com/u/59452120?v=4",
      "htmlUrl": "https://github.com/excalidraw",
      "type": "Organization"
    },
    "description": "Virtual whiteboard for sketching hand-drawn like diagrams",
    "htmlUrl": "https://github.com/excalidraw/excalidraw",
    "stars": 134432,
    "forks": 15803,
    "openIssues": 3404,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "canvas",
      "collaboration",
      "diagrams",
      "drawing",
      "hacktoberfest"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:35:57Z",
    "createdAt": "2020-01-02T01:04:43Z",
    "defaultBranch": "master"
  },
  {
    "id": 1200597263,
    "name": "graphify",
    "fullName": "Graphify-Labs/graphify",
    "owner": {
      "login": "Graphify-Labs",
      "avatarUrl": "https://avatars.githubusercontent.com/u/297659074?v=4",
      "htmlUrl": "https://github.com/Graphify-Labs",
      "type": "Organization"
    },
    "description": "Turn any codebase, with its docs, SQL schemas, configs, and PDFs, into a queryable knowledge graph. A /graphify skill for Claude Code, Cursor, Codex, and Gemini CLI: local deterministic AST parsing, every edge explained, no vector store.",
    "htmlUrl": "https://github.com/Graphify-Labs/graphify",
    "stars": 133693,
    "forks": 12772,
    "openIssues": 1626,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai-agents",
      "antigravity",
      "ast",
      "claude-code",
      "code-analysis"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T16:11:49Z",
    "createdAt": "2026-04-03T15:49:07Z",
    "defaultBranch": "v8"
  },
  {
    "id": 612354784,
    "name": "llama.cpp",
    "fullName": "ggml-org/llama.cpp",
    "owner": {
      "login": "ggml-org",
      "avatarUrl": "https://avatars.githubusercontent.com/u/134263123?v=4",
      "htmlUrl": "https://github.com/ggml-org",
      "type": "Organization"
    },
    "description": "LLM inference in C/C++",
    "htmlUrl": "https://github.com/ggml-org/llama.cpp",
    "stars": 132126,
    "forks": 24732,
    "openIssues": 2587,
    "language": "C++",
    "languageColor": "#f34b7d",
    "topics": [
      "ggml"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:05:40Z",
    "createdAt": "2023-03-10T18:58:00Z",
    "defaultBranch": "master"
  },
  {
    "id": 561730219,
    "name": "hello-algo",
    "fullName": "krahets/hello-algo",
    "owner": {
      "login": "krahets",
      "avatarUrl": "https://avatars.githubusercontent.com/u/26993056?v=4",
      "htmlUrl": "https://github.com/krahets",
      "type": "User"
    },
    "description": "《Hello 算法》：动画图解、一键运行的数据结构与算法教程。支持简中、繁中、English、日本語，提供 Python, Java, C++, C, C#, JS, Go, Swift, Rust, Ruby, Kotlin, TS, Dart 等代码实现",
    "htmlUrl": "https://github.com/krahets/hello-algo",
    "stars": 130933,
    "forks": 15472,
    "openIssues": 19,
    "language": "Java",
    "languageColor": "#b07219",
    "topics": [
      "algo",
      "algorithm",
      "algorithms",
      "book",
      "data-structure"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T15:45:17Z",
    "createdAt": "2022-11-04T11:08:34Z",
    "defaultBranch": "main"
  },
  {
    "id": 965415649,
    "name": "codex",
    "fullName": "openai/codex",
    "owner": {
      "login": "openai",
      "avatarUrl": "https://avatars.githubusercontent.com/u/14957082?v=4",
      "htmlUrl": "https://github.com/openai",
      "type": "Organization"
    },
    "description": "Lightweight coding agent that runs in your terminal",
    "htmlUrl": "https://github.com/openai/codex",
    "stars": 130606,
    "forks": 20593,
    "openIssues": 24381,
    "language": "Rust",
    "languageColor": "#dea584",
    "topics": [],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T16:09:28Z",
    "createdAt": "2025-04-13T05:37:54Z",
    "defaultBranch": "main"
  },
  {
    "id": 112507086,
    "name": "30-seconds-of-code",
    "fullName": "Chalarangelo/30-seconds-of-code",
    "owner": {
      "login": "Chalarangelo",
      "avatarUrl": "https://avatars.githubusercontent.com/u/8281875?v=4",
      "htmlUrl": "https://github.com/Chalarangelo",
      "type": "User"
    },
    "description": "Coding articles to level up your development skills",
    "htmlUrl": "https://github.com/Chalarangelo/30-seconds-of-code",
    "stars": 129302,
    "forks": 12481,
    "openIssues": 2,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "astro",
      "awesome-list",
      "css",
      "education",
      "es6-javascript"
    ],
    "license": "CC-BY-4.0",
    "updatedAt": "2026-10-23T15:35:17Z",
    "createdAt": "2017-11-29T17:35:03Z",
    "defaultBranch": "master"
  },
  {
    "id": 20580498,
    "name": "kubernetes",
    "fullName": "kubernetes/kubernetes",
    "owner": {
      "login": "kubernetes",
      "avatarUrl": "https://avatars.githubusercontent.com/u/13629408?v=4",
      "htmlUrl": "https://github.com/kubernetes",
      "type": "Organization"
    },
    "description": "Production-Grade Container Scheduling and Management",
    "htmlUrl": "https://github.com/kubernetes/kubernetes",
    "stars": 128576,
    "forks": 47106,
    "openIssues": 3207,
    "language": "Go",
    "languageColor": "#00ADD8",
    "topics": [
      "cncf",
      "containers",
      "go",
      "kubernetes"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T15:31:36Z",
    "createdAt": "2014-06-06T22:56:04Z",
    "defaultBranch": "master"
  },
  {
    "id": 29028775,
    "name": "react-native",
    "fullName": "react/react-native",
    "owner": {
      "login": "react",
      "avatarUrl": "https://avatars.githubusercontent.com/u/102812?v=4",
      "htmlUrl": "https://github.com/react",
      "type": "Organization"
    },
    "description": "A framework for building native applications using React",
    "htmlUrl": "https://github.com/react/react-native",
    "stars": 126769,
    "forks": 25355,
    "openIssues": 1243,
    "language": "C++",
    "languageColor": "#f34b7d",
    "topics": [
      "android",
      "app-framework",
      "cross-platform",
      "ios",
      "mobile"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:11:24Z",
    "createdAt": "2015-01-09T18:10:16Z",
    "defaultBranch": "main"
  },
  {
    "id": 299354207,
    "name": "rustdesk",
    "fullName": "rustdesk/rustdesk",
    "owner": {
      "login": "rustdesk",
      "avatarUrl": "https://avatars.githubusercontent.com/u/71636191?v=4",
      "htmlUrl": "https://github.com/rustdesk",
      "type": "User"
    },
    "description": "An open-source remote desktop application designed for self-hosting, as an alternative to TeamViewer.",
    "htmlUrl": "https://github.com/rustdesk/rustdesk",
    "stars": 126710,
    "forks": 19947,
    "openIssues": 190,
    "language": "Rust",
    "languageColor": "#dea584",
    "topics": [
      "android",
      "anydesk",
      "dart",
      "flatpak",
      "flutter"
    ],
    "license": "AGPL-3.0",
    "updatedAt": "2026-10-23T15:55:33Z",
    "createdAt": "2020-09-28T15:36:08Z",
    "defaultBranch": "master"
  },
  {
    "id": 585146387,
    "name": "ui",
    "fullName": "shadcn-ui/ui",
    "owner": {
      "login": "shadcn-ui",
      "avatarUrl": "https://avatars.githubusercontent.com/u/139895814?v=4",
      "htmlUrl": "https://github.com/shadcn-ui",
      "type": "Organization"
    },
    "description": "Composable, accessible components with thoughtful defaults. Build your own component library with code you can customize, extend, and make your own.",
    "htmlUrl": "https://github.com/shadcn-ui/ui",
    "stars": 126322,
    "forks": 13297,
    "openIssues": 1789,
    "language": "TypeScript",
    "languageColor": "#3178c6",
    "topics": [
      "ai",
      "base-ui",
      "components",
      "gen-ui",
      "generative-ai"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:57:16Z",
    "createdAt": "2023-01-04T12:43:27Z",
    "defaultBranch": "main"
  },
  {
    "id": 9384267,
    "name": "electron",
    "fullName": "electron/electron",
    "owner": {
      "login": "electron",
      "avatarUrl": "https://avatars.githubusercontent.com/u/13409222?v=4",
      "htmlUrl": "https://github.com/electron",
      "type": "Organization"
    },
    "description": ":electron: Build cross-platform desktop apps with JavaScript, HTML, and CSS",
    "htmlUrl": "https://github.com/electron/electron",
    "stars": 123505,
    "forks": 17669,
    "openIssues": 766,
    "language": "C++",
    "languageColor": "#f34b7d",
    "topics": [
      "c-plus-plus",
      "chrome",
      "css",
      "electron",
      "html"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:06:05Z",
    "createdAt": "2013-04-12T01:47:36Z",
    "defaultBranch": "main"
  },
  {
    "id": 55076063,
    "name": "Awesome-Hacking",
    "fullName": "Hack-with-Github/Awesome-Hacking",
    "owner": {
      "login": "Hack-with-Github",
      "avatarUrl": "https://avatars.githubusercontent.com/u/18143746?v=4",
      "htmlUrl": "https://github.com/Hack-with-Github",
      "type": "Organization"
    },
    "description": "A collection of various awesome lists for hackers, pentesters and security researchers",
    "htmlUrl": "https://github.com/Hack-with-Github/Awesome-Hacking",
    "stars": 123422,
    "forks": 10865,
    "openIssues": 42,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "android",
      "awesome",
      "bug-bounty",
      "fuzzing",
      "hacking"
    ],
    "license": "CC0-1.0",
    "updatedAt": "2026-10-23T16:12:29Z",
    "createdAt": "2016-03-30T15:47:10Z",
    "defaultBranch": "master"
  },
  {
    "id": 1197515131,
    "name": "awesome-design-md",
    "fullName": "VoltAgent/awesome-design-md",
    "owner": {
      "login": "VoltAgent",
      "avatarUrl": "https://avatars.githubusercontent.com/u/201282378?v=4",
      "htmlUrl": "https://github.com/VoltAgent",
      "type": "Organization"
    },
    "description": "A collection of DESIGN.md files analysis by popular brand design systems. Drop one into your project and let coding agents generate a matching UI.",
    "htmlUrl": "https://github.com/VoltAgent/awesome-design-md",
    "stars": 123117,
    "forks": 13662,
    "openIssues": 311,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "awesome-list",
      "design-md",
      "design-system",
      "design-tokens",
      "figma"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:09:47Z",
    "createdAt": "2026-03-31T16:37:01Z",
    "defaultBranch": "main"
  },
  {
    "id": 27193779,
    "name": "node",
    "fullName": "nodejs/node",
    "owner": {
      "login": "nodejs",
      "avatarUrl": "https://avatars.githubusercontent.com/u/9950313?v=4",
      "htmlUrl": "https://github.com/nodejs",
      "type": "Organization"
    },
    "description": "Node.js JavaScript runtime ✨🐢🚀✨",
    "htmlUrl": "https://github.com/nodejs/node",
    "stars": 122684,
    "forks": 39940,
    "openIssues": 1261,
    "language": "JavaScript",
    "languageColor": "#f7df1e",
    "topics": [
      "javascript",
      "js",
      "linux",
      "macos",
      "mit"
    ],
    "license": "NOASSERTION",
    "updatedAt": "2026-10-23T16:05:57Z",
    "createdAt": "2014-11-26T19:57:11Z",
    "defaultBranch": "main"
  },
  {
    "id": 655806940,
    "name": "generative-ai-for-beginners",
    "fullName": "microsoft/generative-ai-for-beginners",
    "owner": {
      "login": "microsoft",
      "avatarUrl": "https://avatars.githubusercontent.com/u/6154722?v=4",
      "htmlUrl": "https://github.com/microsoft",
      "type": "Organization"
    },
    "description": "21 Lessons, Get Started Building with Generative AI ",
    "htmlUrl": "https://github.com/microsoft/generative-ai-for-beginners",
    "stars": 121994,
    "forks": 64554,
    "openIssues": 14,
    "language": "Jupyter Notebook",
    "languageColor": "#8b949e",
    "topics": [
      "ai",
      "azure",
      "chatgpt",
      "dall-e",
      "generative-ai"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:13:00Z",
    "createdAt": "2023-06-19T16:28:59Z",
    "defaultBranch": "main"
  },
  {
    "id": 724712,
    "name": "rust",
    "fullName": "rust-lang/rust",
    "owner": {
      "login": "rust-lang",
      "avatarUrl": "https://avatars.githubusercontent.com/u/5430905?v=4",
      "htmlUrl": "https://github.com/rust-lang",
      "type": "Organization"
    },
    "description": "Empowering everyone to build reliable and efficient software.",
    "htmlUrl": "https://github.com/rust-lang/rust",
    "stars": 120702,
    "forks": 18739,
    "openIssues": 12635,
    "language": "Rust",
    "languageColor": "#dea584",
    "topics": [
      "compiler",
      "language",
      "rust"
    ],
    "license": "Apache-2.0",
    "updatedAt": "2026-10-23T15:42:03Z",
    "createdAt": "2010-06-16T20:39:03Z",
    "defaultBranch": "main"
  },
  {
    "id": 14098069,
    "name": "free-programming-books-zh_CN",
    "fullName": "justjavac/free-programming-books-zh_CN",
    "owner": {
      "login": "justjavac",
      "avatarUrl": "https://avatars.githubusercontent.com/u/359395?v=4",
      "htmlUrl": "https://github.com/justjavac",
      "type": "User"
    },
    "description": ":books: 免费的计算机编程类中文书籍，欢迎投稿",
    "htmlUrl": "https://github.com/justjavac/free-programming-books-zh_CN",
    "stars": 119331,
    "forks": 28252,
    "openIssues": 7,
    "language": "Plain Text",
    "languageColor": "#8b949e",
    "topics": [
      "android",
      "angular",
      "books",
      "free",
      "ios"
    ],
    "license": "GPL-3.0",
    "updatedAt": "2026-10-23T15:54:11Z",
    "createdAt": "2013-11-04T01:59:19Z",
    "defaultBranch": "main"
  },
  {
    "id": 881458615,
    "name": "browser-use",
    "fullName": "browser-use/browser-use",
    "owner": {
      "login": "browser-use",
      "avatarUrl": "https://avatars.githubusercontent.com/u/192012301?v=4",
      "htmlUrl": "https://github.com/browser-use",
      "type": "Organization"
    },
    "description": "Open-source Python library for AI browser agents, plus Browser Use Cloud: stealth browsers and a hosted agent API.",
    "htmlUrl": "https://github.com/browser-use/browser-use",
    "stars": 118960,
    "forks": 13214,
    "openIssues": 596,
    "language": "Python",
    "languageColor": "#3572A5",
    "topics": [
      "ai-agents",
      "ai-tools",
      "browser-agent",
      "browser-automation",
      "browser-use"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T16:09:34Z",
    "createdAt": "2024-10-31T16:00:56Z",
    "defaultBranch": "main"
  },
  {
    "id": 15634981,
    "name": "godot",
    "fullName": "godotengine/godot",
    "owner": {
      "login": "godotengine",
      "avatarUrl": "https://avatars.githubusercontent.com/u/6318500?v=4",
      "htmlUrl": "https://github.com/godotengine",
      "type": "Organization"
    },
    "description": "Godot Engine – Multi-platform 2D and 3D game engine",
    "htmlUrl": "https://github.com/godotengine/godot",
    "stars": 118954,
    "forks": 27174,
    "openIssues": 18904,
    "language": "C++",
    "languageColor": "#f34b7d",
    "topics": [
      "game-development",
      "game-engine",
      "gamedev",
      "godot",
      "godotengine"
    ],
    "license": "MIT",
    "updatedAt": "2026-10-23T15:49:28Z",
    "createdAt": "2014-01-04T16:05:36Z",
    "defaultBranch": "master"
  },
  {
    "id": 199570071,
    "name": "v2rayN",
    "fullName": "2dust/v2rayN",
    "owner": {
      "login": "2dust",
      "avatarUrl": "https://avatars.githubusercontent.com/u/31833384?v=4",
      "htmlUrl": "https://github.com/2dust",
      "type": "User"
    },
    "description": "A GUI client for Windows, Linux and macOS, support Xray and sing-box and others",
    "htmlUrl": "https://github.com/2dust/v2rayN",
    "stars": 118935,
    "forks": 16147,
    "openIssues": 57,
    "language": "C#",
    "languageColor": "#178600",
    "topics": [
      "proxy",
      "shadowsocks",
      "socks5",
      "trojan",
      "v2fly"
    ],
    "license": "GPL-3.0",
    "updatedAt": "2026-10-23T15:54:42Z",
    "createdAt": "2019-07-30T03:47:24Z",
    "defaultBranch": "master"
  }
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
    const trimmed = language.trim();
    const langTerm = trimmed.includes(" ") ? `"${trimmed}"` : trimmed;
    queryParts.push(`language:${langTerm}`);
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
        if (text.length > 300000) {
          return text.slice(0, 300000) + `\n\n*(README preview truncated for performance. View full documentation on [GitHub](https://github.com/${owner}/${repo}))*`;
        }
        return text;
      }
    }
  } catch {}

  const candidateBranches = ["main", "master", "canary"];
  for (const branch of candidateBranches) {
    try {
      const rawRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          next: { revalidate: 600 },
        }
      );
      if (rawRes.ok) {
        const text = await rawRes.text();
        if (text.trim().length > 0) {
          if (text.length > 300000) {
            return text.slice(0, 300000) + `\n\n*(README preview truncated for performance. View full documentation on [GitHub](https://github.com/${owner}/${repo}))*`;
          }
          return text;
        }
      }
    } catch {}
  }

  return `# ${owner}/${repo}\n\nRepository details and source code are available at [https://github.com/${owner}/${repo}](https://github.com/${owner}/${repo}).`;
}
