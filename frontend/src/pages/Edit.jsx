import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../markdown.css';

function Edit() {
  const [content, setContent] = useState('');

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'content.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit</h1>
      <div className="flex my-2">
        <div className="w-1/2 pr-4">
          <textarea
            value={content}
            onChange={handleChange}
            className="w-full h-screen p-2 border border-input rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="w-1/2 pl-4">
          <div className="w-full h-fit p-4 border rounded-md shadow">
            <div className="markdown">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-primary hover:bg-slate-700 text-primary-foreground font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Save
      </button>
    </div>
  );
}

export default Edit;