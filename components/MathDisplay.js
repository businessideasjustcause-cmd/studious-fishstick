import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/**
 * MathDisplay component renders mathematical equations using KaTeX
 * Detects LaTeX notation and renders it properly
 */
export default function MathDisplay({ content, inline = false }) {
  if (!content) return null;

  // Check if content contains LaTeX delimiters
  const hasInlineMath = /\$[^$]+\$/g.test(content);
  const hasBlockMath = /\$\$[\s\S]+?\$\$/g.test(content);

  if (!hasInlineMath && !hasBlockMath) {
    // No math notation, return as plain text
    return <div className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">{content}</div>;
  }

  // Parse and render mixed content with math
  const renderContent = () => {
    const parts = [];
    let lastIndex = 0;

    // First handle block math ($$...$$)
    const blockRegex = /\$\$([\s\S]+?)\$\$/g;
    let blockMatch;
    const blockMatches = [];

    while ((blockMatch = blockRegex.exec(content)) !== null) {
      blockMatches.push({
        type: 'block',
        math: blockMatch[1],
        start: blockMatch.index,
        end: blockMatch.index + blockMatch[0].length,
      });
    }

    // Process blocks
    if (blockMatches.length > 0) {
      blockMatches.forEach((match, i) => {
        if (match.start > lastIndex) {
          const text = content.substring(lastIndex, match.start);
          if (text.trim()) {
            parts.push(
              <div key={`text-${i}`} className="mb-2 text-gray-900">
                {text.trim()}
              </div>
            );
          }
        }
        parts.push(
          <div key={`math-${i}`} className="my-4 bg-blue-50 p-4 rounded-lg border border-blue-200 overflow-x-auto">
            <BlockMath>{match.math}</BlockMath>
          </div>
        );
        lastIndex = match.end;
      });

      if (lastIndex < content.length) {
        const remaining = content.substring(lastIndex);
        if (remaining.trim()) {
          parts.push(
            <div key="text-end" className="mt-2 text-gray-900">
              {remaining.trim()}
            </div>
          );
        }
      }
    } else {
      // Handle inline math ($...$)
      const inlineRegex = /\$([^$]+)\$/g;
      let inlineMatch;

      while ((inlineMatch = inlineRegex.exec(content)) !== null) {
        if (inlineMatch.index > lastIndex) {
          const text = content.substring(lastIndex, inlineMatch.index);
          if (text) {
            parts.push(
              <span key={`text-${parts.length}`} className="text-gray-900">
                {text}
              </span>
            );
          }
        }
        parts.push(
          <InlineMath key={`math-${parts.length}`}>{inlineMatch[1]}</InlineMath>
        );
        lastIndex = inlineMatch.index + inlineMatch[0].length;
      }

      if (lastIndex < content.length) {
        const remaining = content.substring(lastIndex);
        if (remaining) {
          parts.push(
            <span key="text-end" className="text-gray-900">
              {remaining}
            </span>
          );
        }
      }
    }

    return parts.length > 0 ? parts : <div className="text-gray-900">{content}</div>;
  };

  return (
    <div className="text-lg leading-relaxed whitespace-pre-wrap">
      {renderContent()}
    </div>
  );
}
