import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/components/AuthContext";

const FileBrowser = ({ onFileSelect, searchText = "", searchResults = [] }) => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user || !Array.isArray(user.files) || user.files.length === 0) {
        setFiles([]);
        return;
      }

      try {
        const rawFiles = await fetch("http://localhost:3000/file/user-files", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }).then(async (response) => {
          if (response.ok) {
            const files = await response.json();
            return files;
          } else {
            console.error(`Failed to fetch files`);
            return null;
          }
        });

        const processedFiles = rawFiles.map((file) => {
          return {
            id: file._id,
            name: file.fileName,
            dateCreated: file.dateCreated,
          };
        });
        const filteredFiles = processedFiles.filter((file) => file !== null);

        if (searchResults !== null) {
          const searchFiles = searchResults.map((file) => ({
            id: file._id,
            name: file.fileName,
            dateCreated: file.dateCreated,
          }));
          const combinedResults = [
            ...searchFiles,
            ...filteredFiles.filter(
              (file) =>
                file.name.toLowerCase().includes(searchText.toLowerCase()) &&
                !searchFiles.some((searchFile) => searchFile.id === file.id),
            ),
          ];
          setFiles(combinedResults);
        } else {
          setFiles(filteredFiles);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
      }
    };

    fetchFiles();
  }, [user, searchText, searchResults]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              onClick={() => {
                navigate("/edit", { state: { fileId: file.id } });
                onFileSelect();
              }}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>
                {new Date(file.dateCreated).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default FileBrowser;
