import ReactMarkdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~components/ui/tooltip';

const MarkdownWithCitations = ({
  content,
  citations,
}: {
  content: string;
  citations?: Array<{
    url: string;
    title: string | null;
  }>;
}) => {
  const processedContent = content.replace(/\[(\d+)\]/g, (_, num) => {
    const citation = citations?.[parseInt(num) - 1];
    return citation ? `[${num}](${citation.url} "${citation.title}")` : `[${num}]`;
  });

  return (
    <TooltipProvider>
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <Tooltip>
              <TooltipTrigger>
                <a
                  {...props}
                  className="transition-colors duration-200 ease-in-out text-white w-[13px] h-[13px] align-top rounded-full bg-slate-600 hover:bg-slate-500 inline-flex items-center justify-center text-[9px] ml-0.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.children}
                </a>
              </TooltipTrigger>
              <TooltipContent>{props.title}</TooltipContent>
            </Tooltip>
          ),
          p: ({ node, ...props }) => <p {...props} className="text-sm text-gray-700 py-1" />,
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-xl font-light py-1 text-gray-700" />
          ),
          ul: ({ node, ...props }) => <ul {...props} className="list-disc text-gray-700 pl-4" />,
          li: ({ node, ...props }) => <li {...props} className="text-sm text-gray-700 py-1" />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </TooltipProvider>
  );
};

export { MarkdownWithCitations };
