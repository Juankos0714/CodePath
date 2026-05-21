"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

interface LessonContentProps {
  markdown: string;
}

export function LessonContent({ markdown }: LessonContentProps) {
  return (
    <article className="prose-lesson">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          // Open external links in new tab
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          // Inline code styling
          code: ({ children, className, ...props }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-[var(--color-muted)] px-1.5 py-0.5 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
