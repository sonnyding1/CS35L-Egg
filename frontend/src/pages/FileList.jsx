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

const FileList = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [likedFiles, setLikedFiles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user || !Array.isArray(user.files) || user.files.length === 0) {
        setFiles([]);
        setLikedFiles([]);
        return;
      }

      try {
        const filePromises = user.files.map(async (fileId) => {
          const response = await fetch(
            "http://localhost:3000/file/user-files",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ _id: fileId }),
            },
          );

          if (response.ok) {
            const file = await response.json();
            return {
              id: fileId,
              name: file[0].fileName,
              dateCreated: file[0].dateCreated,
            };
          } else if (response.status === 404) {
            console.warn(`File with ID ${fileId} not found`);
            return null;
          } else {
            console.error(`Failed to fetch file name for ID ${fileId}`);
            return null;
          }
        });

        const fetchedFiles = await Promise.all(filePromises);
        const filteredFiles = fetchedFiles.filter((file) => file !== null);
        setFiles(filteredFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
      }
    };

    fetchFiles();
  }, [user]);

  useEffect(() => {
    const fetchLikedFiles = async () => {
      if (
        !user ||
        !Array.isArray(user.likedFiles) ||
        user.likedFiles.length === 0
      ) {
        setLikedFiles([]);
        return;
      }

      try {
        const likedFilePromises = user.likedFiles.map(async (fileId) => {
          const response = await fetch(
            "http://localhost:3000/file/user-files",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ _id: fileId }),
            },
          );

          if (response.ok) {
            const file = await response.json();
            return {
              id: fileId,
              name: file[0].fileName,
              dateCreated: file[0].dateCreated,
            };
          } else if (response.status === 404) {
            console.warn(`Liked file with ID ${fileId} not found`);
            return null;
          } else {
            console.error(`Failed to fetch liked file name for ID ${fileId}`);
            return null;
          }
        });

        const fetchedLikedFiles = await Promise.all(likedFilePromises);
        const filteredLikedFiles = fetchedLikedFiles.filter(
          (file) => file !== null,
        );
        setLikedFiles(filteredLikedFiles);
      } catch (error) {
        console.error("Error fetching liked files:", error);
        setLikedFiles([]);
      }
    };

    fetchLikedFiles();
  }, [user]);

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
                key={file.id}
                onClick={() => {
                  navigate("/posts/" + file.id);
                }}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>{file.id}</TableCell>
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
                key={file.id}
                onClick={() => {
                  navigate("/posts/" + file.id);
                }}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell>{file.id}</TableCell>
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
