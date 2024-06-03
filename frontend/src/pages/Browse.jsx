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
import { useNavigate } from "react-router-dom";

const Browse = () => {
  const [isFileCreationDialogOpen, setFileCreationDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const navigate = useNavigate();

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
        const file = await response.json();
        navigate("/edit", { state: { fileId: file._id } });
      } else {
        const error = await response.json();
        console.error(error);
      }
      setFileCreationDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (!searchText) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/file/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: searchText }),
      });
      if (response.ok) {
        const files = await response.json();
        setSearchResults(files);
      } else {
        const error = await response.json();
        console.error(error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    }
  };

  return (
    <>
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

      <div className="flex space-x-4 p-4">
        <Button onClick={() => setFileCreationDialogOpen(true)}>
          Create File
        </Button>
        <Input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search file content..."
        />
        <Button onClick={handleSearch}>Search Content</Button>
      </div>

      <div className="m-4 border rounded-md">
        <FileBrowser
          onFileSelect={() => null}
          searchText={searchText}
          searchResults={searchResults}
        />
      </div>
    </>
  );
};

export default Browse;
