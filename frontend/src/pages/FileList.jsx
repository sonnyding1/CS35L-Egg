import { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/components/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FileList = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [likedFiles, setLikedFiles] = useState([]);

  const navigate = useNavigate();

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

    const fetchLikedFiles = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/file/user-liked/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );
        if (response.ok) {
          const file = await response.json();
          setLikedFiles(file.likedFiles);
        } else {
          throw new Error("Liked file fetch failed");
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    };
    fetchFiles();
    fetchLikedFiles();
  }, []);

  return (
    <>
      <div className="border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>My Files</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow
                key={file._id}
                onClick={() => {
                  navigate("/posts/" + file._id);
                }}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{file.fileName}</TableCell>
                <TableCell>{file._id}</TableCell>
                <TableCell>
                  {new Date(file.dateCreated).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="border rounded-sm mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Liked Files</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {likedFiles.map((file) => (
              <TableRow
                key={file._id}
                onClick={() => {
                  navigate("/posts/" + file._id);
                }}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{file.fileName}</TableCell>
                <TableCell>{file._id}</TableCell>
                <TableCell>
                  {new Date(file.dateCreated).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default FileList;
