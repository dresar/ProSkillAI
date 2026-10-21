import { codeToHtml } from "shiki";

const monochromeTheme = {
  name: "proskill-monochrome",
  type: "dark" as const,
  colors: {
    "editor.background": "transparent",
    "editor.foreground": "#d4d4d4",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { fontStyle: "italic", foreground: "#737373" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
      settings: { fontStyle: "bold", foreground: "#ffffff" },
    },
    {
      scope: ["string", "string.quoted", "string.template"],
      settings: { foreground: "#a3a3a3" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: "#d4d4d4" },
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { fontStyle: "bold", foreground: "#f5f5f5" },
    },
    {
      scope: ["variable", "variable.parameter"],
      settings: { foreground: "#e5e5e5" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { fontStyle: "bold", foreground: "#d4d4d4" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#a3a3a3" },
    },
  ],
};

export async function highlightCode(code: string, lang = "text"): Promise<string> {
  const cleanLang = lang.replace(/^language-/, "").toLowerCase();
  const supportedLangs = [
    "typescript",
    "javascript",
    "bash",
    "sh",
    "json",
    "markdown",
    "yaml",
    "yml",
    "html",
    "css",
    "python",
    "text",
  ];
  const targetLang = supportedLangs.includes(cleanLang) ? cleanLang : "text";

  try {
    return await codeToHtml(code, {
      lang: targetLang,
      theme: monochromeTheme,
    });
  } catch {
    return `<pre><code>${code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  }
}
