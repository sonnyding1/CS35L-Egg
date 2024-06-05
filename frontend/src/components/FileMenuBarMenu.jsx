import { useCallback, useEffect, useState } from "react";
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
  MenubarCheckboxItem,
} from "@/components/ui/menubar";
import FileBrowser from "@/pages/FileBrowser";
import { useNavigate } from "react-router-dom";

const FileMenuBarMenu = ({
  fileID,
  fileName,
  onFileNameChange,
  onContentChange,
  isFileNameDialogOpen,
  setFileNameDialogOpen,
  content,
  isFilePublic,
  setFilePublic,
  setSonnerMessage,
}) => {
  const [isFileUploadDialogOpen, setFileUploadDialogOpen] = useState(false);
  const [isFileBrowserDialogOpen, setFileBrowserDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const isMac = navigator.userAgent.includes("Macintosh");
  const modKeySymbol = isMac ? "&#8984;" : "Ctrl+";

  const navigate = useNavigate();

  const handleOpenFile = useCallback(() => {
    setFileBrowserDialogOpen(true);
  }, []);

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
    setSonnerMessage("File downloaded successfully");
  };

  const updateFile = useCallback(async (updatedFile, onSuccess, onError) => {
    try {
      const response = await fetch("http://localhost:3000/update/user/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedFile),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        onError(error);
      }
    } catch (error) {
      onError(error);
    }
  }, []);

  const handleRename = async (e) => {
    e.preventDefault();
    const newFileName = e.target.newFileName.value;

    const updatedFile = {
      _id: fileID,
      fileName: newFileName,
    };

    updateFile(
      updatedFile,
      () => {
        onFileNameChange(newFileName);
        setFileNameDialogOpen(false);
        console.log("File renamed successfully.");
      },
      console.error,
    );
  };

  const handleSave = useCallback(async () => {
    const updatedFile = {
      _id: fileID,
      fileName: fileName,
      text: content,
    };

    updateFile(
      updatedFile,
      () => {
        console.log("File saved successfully.");
      },
      console.error,
    );

    setSonnerMessage("File saved successfully");
  }, [content, fileName, fileID, updateFile, setSonnerMessage]);

  const handleDelete = async () => {
    try {
      const response = await fetch("http://localhost:3000/delete/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ _id: fileID }),
      });

      if (response.ok) {
        console.log("File deleted successfully.");
        navigate("/browse");
      } else {
        const error = await response.json();
        console.error("File deletion failed:", error);
      }
    } catch (error) {
      console.error("File deletion failed:", error);
    }
  };

  const handleFileIsPublic = async () => {
    const updatedFile = {
      _id: fileID,
      public: !isFilePublic,
    };

    updateFile(
      updatedFile,
      () => {
        setFilePublic(!isFilePublic);
        console.log("File toggled public.");
        if (isFilePublic) {
          setSonnerMessage("File toggled to private");
        } else {
          setSonnerMessage("File toggled to public");
        }
      },
      console.error,
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.userAgent.includes("Macintosh");
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey && e.key === "o" && !e.shiftKey) {
        e.preventDefault();
        handleOpenFile();
      }

      if (modKey && e.key === "s" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleOpenFile, handleSave]);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={handleOpenFile}>
            Open
            <MenubarShortcut
              dangerouslySetInnerHTML={{ __html: modKeySymbol + "O" }}
            />
          </MenubarItem>
          <MenubarItem onSelect={handleUploadFile}>Upload</MenubarItem>
          <MenubarItem onSelect={handleDownload}>Download</MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={() => setFileNameDialogOpen(true)}>
            Rename
          </MenubarItem>
          <MenubarItem onSelect={handleSave}>
            Save
            <MenubarShortcut
              dangerouslySetInnerHTML={{ __html: modKeySymbol + "S" }}
            />
          </MenubarItem>
          <MenubarItem onSelect={handleDelete}>Delete</MenubarItem>
          <MenubarCheckboxItem
            checked={isFilePublic}
            onCheckedChange={handleFileIsPublic}
          >
            Public
          </MenubarCheckboxItem>
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
        <DialogContent className="max-w-[720px]">
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
