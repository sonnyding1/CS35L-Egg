import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
    link.download = FILENAMEGLOBAL;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <Menubar className="mb-2">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={handleSave}>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onSelect={() => setFileNameDialogOpen(true)}>
              Rename
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Dialog open={isFileNameDialogOpen} onOpenChange={setFileNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename {FILENAMEGLOBAL}</DialogTitle>
          </DialogHeader>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="name" placeholder="" />
            <Button type="submit">Rename</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-grow flex">
        <div className="w-1/2 pr-4">
          <Textarea
            value={content}
            onChange={handleChange}
            className="w-full h-full"
          />
        </div>
        <div className="w-1/2 pl-4">
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
