import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
//import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MarkdownProps {
  content: string;
  useTheme?: boolean;
}

export const Markdown = ({ content, useTheme = true }: MarkdownProps) => {
  interface CodeProps {
    node: Element;
    inline: boolean | undefined;
    className: string | undefined;
    children: React.ReactNode & React.ReactNode[];
  }

  const MarkdownComponents: object = {
    // eslint-disable-next-line unused-imports/no-unused-vars
    code({ node, inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={useTheme ? darcula : undefined}
          language={match[1]}
          PreTag='div'
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
  return (
    <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
  );
};
