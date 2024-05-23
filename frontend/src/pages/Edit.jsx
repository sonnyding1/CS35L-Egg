import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import "../markdown.css";
import EditMenuBar from "@/components/EditMenuBar";
import { Pencil1Icon } from "@radix-ui/react-icons";

const FILENAMEGLOBAL = "content";

function Edit() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [isFileNameDialogOpen, setFileNameDialogOpen] = useState(false);
  const [isFileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

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

  const handleOpenFile = () => {
    // Some backend to load file.
  };

  const handleUploadFile = () => {
    setFileUploadDialogOpen(true);
  };

  const handleFileUpload = () => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target.result);
        setFileName(uploadedFile.name);
      };
      reader.readAsText(uploadedFile);
      setFileUploadDialogOpen(false);
    }
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRename = () => {
    // Some backend to rename file.
    setFileNameDialogOpen(false);
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
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={handleOpenFile}>
              Open <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={handleUploadFile}>Upload</MenubarItem>
            <MenubarItem onSelect={handleSave}>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={() => setFileNameDialogOpen(true)}>
              Rename
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <EditMenuBar
          content={content}
          textareaRef={textareaRef}
          onContentChange={setContent}
        />
      </Menubar>

      <Dialog open={isFileNameDialogOpen} onOpenChange={setFileNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename file to: {fileName}</DialogTitle>
          </DialogHeader>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter new file name"
            />
            <Button type="submit" onClick={handleRename}>
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isFileUploadDialogOpen}
        onOpenChange={setFileUploadDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="file"
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />
            <Button type="submit" onClick={handleFileUpload}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
