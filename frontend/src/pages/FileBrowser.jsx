import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FileBrowser = ({ onFileSelect, searchResults = null }) => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const filesToDisplay = searchResults != null ? searchResults : files;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/file/user-files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          credentials: "include",
        });
        if (response.ok) {
          const file = await response.json();
          setFiles(file);
        } else {
          throw new Error("File fetch failed");
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    };
    fetchFiles();
  }, []);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Public</TableHead>
            <TableHead>Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filesToDisplay.map((file) => (
            <TableRow
              key={file._id}
              onClick={() => {
                navigate("/edit", { state: { fileId: file._id } });
                onFileSelect();
              }}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{file.fileName}</TableCell>
              <TableCell>
                {new Date(file.dateCreated).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(file.lastModified).toLocaleString()}
              </TableCell>
              <TableCell>{file.public ? "Yes" : "No"}</TableCell>
              <TableCell>{file.likeCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default FileBrowser;
