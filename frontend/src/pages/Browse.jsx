import { Button } from "@/components/ui/button";
import FileBrowser from "./FileBrowser";
import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/components/AuthContext";

const Browse = () => {
  const [isFileCreationDialogOpen, setFileCreationDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults(null);
    }
  }, [searchText]);

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

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const matchingFiles = [];
      const fileIDs = user.files;

      for (const fileID of fileIDs) {
        const response = await fetch(
          "http://localhost:3000/file/user-files/text",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ _id: fileID }),
          },
        );

        if (!response.ok) {
          console.error(`File search failed for fileID: ${fileID}`);
          continue;
        }

        const files = await response.json();
        const file = files[0];
        if (
          (file.text &&
            file.text.toLowerCase().includes(searchText.toLowerCase())) ||
          (file.fileName &&
            file.fileName.toLowerCase().includes(searchText.toLowerCase()))
        ) {
          matchingFiles.push(file);
        }
      }

      setSearchResults(matchingFiles);
    } catch (error) {
      console.error("Error:", error);
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

      <form className="flex space-x-4 p-4" onSubmit={handleSearch}>
        <Input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search files..."
        />
        <Button type="submit">Search Content</Button>
      </form>

      {/* <div className="flex space-x-4 p-4">
        <Button onClick={() => setFileCreationDialogOpen(true)}>
          Create File
        </Button>
        <Input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search files..."
        />
        <Button onClick={handleSearch}>Search Content</Button>
      </div> */}

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
