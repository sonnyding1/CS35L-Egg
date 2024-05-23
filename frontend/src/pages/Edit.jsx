import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Menubar } from "@/components/ui/menubar";
import "../markdown.css";
import EditMenuBar from "@/components/EditMenuBarMenu";
import FileMenuBar from "@/components/FileMenuBarMenu";
import { Pencil1Icon } from "@radix-ui/react-icons";

const FILENAMEGLOBAL = "content";

function Edit() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isFileNameDialogOpen, setFileNameDialogOpen] = useState(false);

  useEffect(() => {
    setFileName(FILENAMEGLOBAL);
    const loadContent = async () => {
      try {
        const response = await fetch(FILENAMEGLOBAL);
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

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="flex items-center justify-center mb-2">
        <h1 className="text-xl font-bold text-center">{fileName}</h1>
        <Button
          className="ml-2"
          size="sm"
          variant="outline"
          onClick={() => setFileNameDialogOpen(true)}
        >
          <Pencil1Icon />
        </Button>
      </div>
      <Menubar className="mb-2">
        <FileMenuBar
          fileName={fileName}
          onFileNameChange={setFileName}
          onContentChange={setContent}
          isFileNameDialogOpen={isFileNameDialogOpen}
          setFileNameDialogOpen={setFileNameDialogOpen}
          content={content}
        />
        <EditMenuBar
          content={content}
          textareaRef={textareaRef}
          onContentChange={setContent}
        />
      </Menubar>
      <div className="flex-grow flex mt-2">
        <div className="w-1/2 pr-2">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            className="w-full h-full"
          />
        </div>
        <div className="w-1/2 pl-2">
          <Card className="h-full">
            <CardContent className="h-full pt-2 overflow-y-auto">
              <div className="markdown">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Edit;
