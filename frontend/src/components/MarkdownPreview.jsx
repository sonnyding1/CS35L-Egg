import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "../markdown.css";

const MarkdownPreview = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={rehypeKatex}
      className="markdown"
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownPreview;
