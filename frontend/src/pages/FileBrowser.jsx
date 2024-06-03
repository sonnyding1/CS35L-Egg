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
        const filePromises = user.files.map(async (fileId) => {
          const response = await fetch("http://localhost:3000/file/filename", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ _id: fileId }),
          });

          if (response.ok) {
            const { fileName } = await response.json();
            return { id: fileId, name: fileName };
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

        if (searchResults !== null) {
          const searchFiles = searchResults.map((file) => ({
            id: file._id,
            name: file.fileName,
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              onDoubleClick={() => {
                navigate("/edit", { state: { fileId: file.id } });
                onFileSelect();
              }}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{file.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default FileBrowser;
