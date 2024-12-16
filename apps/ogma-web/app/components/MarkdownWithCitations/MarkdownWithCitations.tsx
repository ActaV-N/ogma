import ReactMarkdown from 'react-markdown';

const MarkdownWithCitations = ({
  content,
  citations,
}: {
  content: string;
  citations?: Array<string>;
}) => {
  // Replace [number] with markdown links
  const processedContent = content.replace(/\[(\d+)\]/g, (_, num) => {
    const citation = citations?.[parseInt(num) - 1];
    return citation ? `[\[${num}\]](${citation})` : `[${num}]`;
  });

  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            className="text-blue-500 hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
};

export { MarkdownWithCitations };
