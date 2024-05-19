import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../markdown.css";

function Edit() {
  const [content, setContent] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        // from some file on the server backend
        const response = await fetch("./content.txt");
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        }
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };

    loadContent();
  }, []);

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "content.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8  h-screen flex flex-col">
      {/* Flex container for header and button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold">Edit</h1>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-slate-700 text-primary-foreground font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Save
        </button>
      </div>
      <div className="flex-grow flex">
        {/* Use flex-grow to ensure the editor and preview sections take up the remaining space */}
        <div className="w-1/2 pr-4 flex flex-col">
          <textarea
            value={content}
            onChange={handleChange}
            className="flex-grow w-full p-2 border border-input rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="w-1/2 pl-4 flex flex-col">
          <div className="flex-grow w-full p-4 border rounded-md shadow overflow-y-auto">
            <div className="markdown">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
