import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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

const FileMenuBarMenu = ({
  fileName,
  onFileNameChange,
  onContentChange,
  isFileNameDialogOpen,
  setFileNameDialogOpen,
  content,
}) => {
  const [isFileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

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
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRename = (e) => {
    e.preventDefault();
    const newFileName = e.target.newFileName.value;
    onFileNameChange(newFileName);
    setFileNameDialogOpen(false);
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
              onChange={(e) => setUploadedFile(e.target.files[0])}
            />
            <Button type="submit" onClick={handleFileUpload}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileMenuBarMenu;
