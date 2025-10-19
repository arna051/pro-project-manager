import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
    language?: string;
    children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'javascript', children }) => {
    return (
        <div style={{ borderRadius: 10, overflow: 'hidden', marginTop: 12, }}>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    maxHeight: 400
                }}
                wrapLines
            >
                {children.trim()}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
