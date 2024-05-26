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

const FileBrowser = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("files.json");
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error loading file data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileDoubleClick = (file) => {
    const filePath = `/files/${file.folder}/${file.fileName}`;
    navigate(filePath);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Public</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file._id}
              onDoubleClick={() => handleFileDoubleClick(file)}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{file.fileName}</TableCell>
              <TableCell>{file.description}</TableCell>
              <TableCell>
                {new Date(file.dateCreated).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(file.lastModified).toLocaleString()}
              </TableCell>
              <TableCell>{file.public ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default FileBrowser;
