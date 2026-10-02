import React from 'react';

interface ReadingViewerProps {
  content: string;
  className?: string;
}

export const ReadingViewer: React.FC<ReadingViewerProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split by line breaks or block tags
  const blocks = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const renderInlineFormatted = (text: string) => {
    // Strip remaining tags but preserve strong / em semantics safely
    const cleanText = text
      .replace(/<h[1-6][^>]*>/gi, '')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/?[a-z0-9]+[^>]*>/gi, '');

    return <span>{cleanText}</span>;
  };

  return (
    <div className={`space-y-4 text-sm leading-relaxed text-gray-200 ${className}`}>
      {blocks.map((block, idx) => {
        const isHeading =
          block.startsWith('<h') ||
          block.startsWith('###') ||
          block.startsWith('##') ||
          block.includes('🃏') ||
          block.includes('🐚') ||
          block.includes('🔢') ||
          block.includes('🌌') ||
          block.includes('🌙') ||
          block.includes('🌹');

        if (isHeading) {
          const cleanHeading = block
            .replace(/^#+\s*/, '')
            .replace(/<[^>]+>/g, '')
            .trim();

          return (
            <h4
              key={idx}
              className="font-serif text-base font-bold text-[#D4AF37] border-b border-[#D4AF37]/20 pb-1 mt-4 first:mt-0 flex items-center gap-2"
            >
              {cleanHeading}
            </h4>
          );
        }

        return (
          <p key={idx} className="text-gray-300 font-sans text-xs md:text-sm">
            {renderInlineFormatted(block)}
          </p>
        );
      })}
    </div>
  );
};
