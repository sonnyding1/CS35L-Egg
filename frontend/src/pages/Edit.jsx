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
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import "../markdown.css";

const FILENAMEGLOBAL = "./content.txt";

function Edit() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [isFileNameDialogOpen, setFileNameDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("");

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

  const handleSave = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // TODO: Implement keyboard shortcuts.
  const handleFormatting = (formatter) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);
    const formattedText = formatter(selectedText);
    const newContent = `${content.slice(0, start)}${formattedText}${content.slice(end)}`;
    
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end);
    }, 0);
  };
  
  const handleBold = () => {
    handleFormatting((text) => `**${text}**`);
  };
  
  const handleItalics = () => {
    handleFormatting((text) => `*${text}*`);
  };

  const handleInlineCodeBlock = () => {
    handleFormatting((text) => `\`${text}\``);
  };

  const handleBlockQuote = () => {
    handleLinePrefix('> ');
  };
  
  const handleLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const startOfLine = value.lastIndexOf('\n', start - 1) + 1;
    const endOfLine = value.indexOf('\n', end);
    const currentLine = value.slice(startOfLine, endOfLine !== -1 ? endOfLine : value.length);
    const newContent = value.slice(0, startOfLine) + prefix + currentLine + value.slice(endOfLine !== -1 ? endOfLine : value.length);
    
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };
  
  const handleHeadingOne = () => {
    handleLinePrefix('# ');
  };
  
  const handleHeadingTwo = () => {
    handleLinePrefix('## ');
  };
  
  const handleBulletPoint = () => {
    handleLinePrefix('- ');
  };
  
  const handleNumberedList = () => {
    handleLinePrefix('1. ');
  };

  

  const handleRename = () => {
    // Some backend to rename file.
    setFileNameDialogOpen(false);
  };

  const handleOpenFile = () => {
    // Some backend to load file.
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <Menubar className="mb-2">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
          <MenubarItem onSelect={handleOpenFile}>
              Open <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={handleSave}>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={() => setFileNameDialogOpen(true)}>
              Rename
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={handleBold}>
              Bold <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={handleItalics}>
              Italics <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={handleInlineCodeBlock}>
              Code <MenubarShortcut>⌘+Shift+C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={handleBlockQuote}>
              Blockquote
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onSelect={handleHeadingOne}>
              Heading 1 <MenubarShortcut>⌘H1</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={handleHeadingTwo}>
              Heading 2 <MenubarShortcut>⌘H2</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Dialog open={isFileNameDialogOpen} onOpenChange={setFileNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename file to: {fileName}</DialogTitle> {/* Use fileName state */}
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