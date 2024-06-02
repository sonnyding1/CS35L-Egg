import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarShortcut,
  MenubarSeparator,
} from "@/components/ui/menubar";
import FileBrowser from "@/pages/FileBrowser";

const FileMenuBarMenu = ({
  fileID,
  fileName,
  onFileNameChange,
  onContentChange,
  isFileNameDialogOpen,
  setFileNameDialogOpen,
  content,
}) => {
  const [isFileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [isFileBrowserDialogOpen, setFileBrowserDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleOpenFile = () => {
    setFileBrowserDialogOpen(true);
  };

  const handleUploadFile = () => {
    setFileUploadDialogOpen(true);
  };

  const handleFileUpload = () => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onContentChange(e.target.result);
        onFileNameChange(uploadedFile.name);
      };
      reader.readAsText(uploadedFile);
      setFileUploadDialogOpen(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    console.log(fileName)
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const handleRename = async (e) => {
    e.preventDefault();
    const newFileName = e.target.newFileName.value;
  
    try {
      const updatedFile = {
        _id: fileID,
        fileName: newFileName,
      };
  
      const response = await fetch("http://localhost:3000/update/user/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedFile),
      });
  
      if (response.ok) {
        onFileNameChange(newFileName);
        setFileNameDialogOpen(false);
        console.log("File renamed successfully.");
      } else {
        const error = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSave = async () => {
    try {
      const updatedFile = {
        _id: fileID,
        fileName: fileName,
        text: content,
        description: "",
      };
      console.log

      const response = await fetch("http://localhost:3000/update/user/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedFile),
      });

      if (response.ok) {
        console.log("File saved successfully.");
      } else {
        const error = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={handleOpenFile}>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={handleUploadFile}>Upload</MenubarItem>
          <MenubarItem onSelect={handleDownload}>Download</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={() => setFileNameDialogOpen(true)}>
            Rename
          </MenubarItem>
          <MenubarItem onSelect={handleSave}>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <Dialog open={isFileNameDialogOpen} onOpenChange={setFileNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename file to: {fileName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRename}>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                name="newFileName"
                defaultValue={fileName}
                placeholder="Enter new file name"
              />
              <Button type="submit">Rename</Button>
            </div>
          </form>
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
              accept=".txt,.md,.markdown,*"
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />
            <Button type="submit" onClick={handleFileUpload}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isFileBrowserDialogOpen}
        onOpenChange={setFileBrowserDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open File</DialogTitle>
          </DialogHeader>
          <FileBrowser onFileSelect={() => setFileBrowserDialogOpen(false)} />
          <DialogFooter>
            <Button onClick={() => setFileBrowserDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileMenuBarMenu;
