import { Button } from "@/components/ui/button";
import FileBrowser from "./FileBrowser";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Browse = () => {
  const [isFileCreationDialogOpen, setFileCreationDialogOpen] = useState(false);
  const [fileCreated, setFileCreated] = useState(false);
  const handleCreateFile = async (e) => {
    e.preventDefault();
    try {
      const newFile = {
        fileName: e.target.newFileName.value,
        text: "",
        description: "",
      };

      const response = await fetch("http://localhost:3000/file/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newFile),
      });

      if (response.ok) {
        console.log("File created successfully.");
        setFileCreated(true);
      } else {
        const error = await response.json();
        console.error(error);
      }
      setFileCreationDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Button className="m-4" onClick={() => setFileCreationDialogOpen(true)}>
        Create File
      </Button>
      <Dialog
        open={isFileCreationDialogOpen}
        onOpenChange={setFileCreationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create File</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateFile}>
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                name="newFileName"
                placeholder="Enter a file name"
              />
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <FileBrowser onFileSelect={() => null} fileCreated={fileCreated} />
    </>
  );
};

export default Browse;
