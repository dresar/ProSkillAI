import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold tracking-tight text-foreground mt-6 mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold tracking-tight text-foreground mt-5 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700 dark:text-neutral-300 mb-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1 text-sm text-neutral-700 dark:text-neutral-300 mb-3">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded text-[12px] font-mono bg-neutral-100 dark:bg-neutral-800 text-foreground border border-neutral-200 dark:border-neutral-700">
                  {children}
                </code>
              );
            }
            return (
              <code className="block p-3 rounded text-xs font-mono bg-neutral-100 dark:bg-neutral-900 text-foreground overflow-x-auto border border-neutral-200 dark:border-neutral-800">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <div className="my-3 overflow-hidden rounded">{children}</div>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-neutral-400 dark:border-neutral-600 pl-4 py-1 italic text-neutral-600 dark:text-neutral-400 my-3">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs border-collapse border border-neutral-200 dark:border-neutral-800">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="p-2 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
