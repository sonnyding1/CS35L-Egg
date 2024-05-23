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
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import "../markdown.css";
import EditMenuBar from "@/components/editmenubar";
import ContentPreview from "@/components/contentpreview";

const FILENAMEGLOBAL = "content";

function Edit() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [isFileNameDialogOpen, setFileNameDialogOpen] = useState(false);
  const [isFileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setFileName(FILENAMEGLOBAL);
    loadContent();
  }, []);

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

  const handleChange = (e) => {
    setContent(e.target.value);
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

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setContent(fileContent);
      setFileName(file.name);
    };
    reader.readAsText(file);
  }
    setFileUploadDialogOpen(false);
  };

  const handleOpenFile = () => {
    // Some backend to load file.
  };

  const handlePublish = () => {
    // Some backend function.
  };

  return (
    <div className="mx-auto px-4 py-4 h-screen flex flex-col">
      <p className="font-bold text-2xl mb-2 text-center">{fileName}</p>
      <Menubar className="mb-2 flex justify-between">
        <div className="flex">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={handleOpenFile}>
                Open <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => setFileUploadDialogOpen(true)}>
                Upload
              </MenubarItem>
              <MenubarItem onSelect={handleSave}>
                Save <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
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
        </div>
        <MenubarMenu>
          <MenubarTrigger>Publish</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={handlePublish}>
              Publish <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
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

      <Dialog open={isFileUploadDialogOpen} onOpenChange={setFileUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload file</DialogTitle>
          </DialogHeader>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="file"
              onChange={handleUploadFile}
            />
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
          <ContentPreview content={content} />
        </div>
      </div>
    </div>
  );
}

export default Edit;