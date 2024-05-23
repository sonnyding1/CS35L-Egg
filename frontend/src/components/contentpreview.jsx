import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

const ContentPreview = ({ content }) => {
  return (
    <Card>
      <CardContent className="h-full mt-4 overflow-y-auto">
        <div className="markdown ">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPreview;