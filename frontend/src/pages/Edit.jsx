import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Menubar } from "@/components/ui/menubar";
import EditMenuBar from "@/components/EditMenuBarMenu";
import FileMenuBar from "@/components/FileMenuBarMenu";
import { Pencil1Icon } from "@radix-ui/react-icons";
import MarkdownPreview from "@/components/MarkdownPreview";
import { Card, CardContent } from "@/components/ui/card";

function Edit() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isFileNameDialogOpen, setFileNameDialogOpen] = useState(false);
  const [past, setPast] = useState("");
  const [future, setFuture] = useState("");
  const timeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileContent = async () => {
      const fileId = location.state?.fileId;
      if (!fileId) {
        // Handle case when fileId is not available
        console.error("File ID not found", fileId);
        navigate("/");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/file/user-files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ _id: fileId }),
        });

        if (response.ok) {
          const data = await response.json();
          setFileName(data[0].fileName);
          setContent(data[0].text);
        } else if (response.status === 401) {
          console.error("Unauthorized access");
          navigate("/login");
        } else if (response.status === 403) {
          console.error("Forbidden access to the file");
          navigate("/");
        } else {
          console.error("Error loading file content:", response.statusText);
        }
      } catch (error) {
        console.error("Error loading file content:", error);
      }
    };

    fetchFileContent();
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setContent(e.target.value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPast([...past, e.target.value]);
      setFuture([]);
    }, 500);
  };

  const onContentChange = (newContent) => {
    setContent(newContent);
    setPast([...past, newContent]);
    setFuture([]);
  };

  return (
    <div className="mx-auto px-4 py-4 h-screen flex flex-col">
      <div className="flex items-center justify-center mb-2">
        <h1 className="text-xl font-bold text-center">{fileName}</h1>
        <Button
          className="ml-2"
          size="sm"
          variant="outline"
          onClick={() => setFileNameDialogOpen(true)}
        >
          <Pencil1Icon />
        </Button>
      </div>
      <Menubar className="mb-2">
        <FileMenuBar
          fileID={location.state?.fileId}
          fileName={fileName}
          onFileNameChange={setFileName}
          onContentChange={setContent}
          isFileNameDialogOpen={isFileNameDialogOpen}
          setFileNameDialogOpen={setFileNameDialogOpen}
          content={content}
        />
        <EditMenuBar
          content={content}
          textareaRef={textareaRef}
          onContentChange={onContentChange}
          past={past}
          future={future}
          setPast={setPast}
          setFuture={setFuture}
        />
      </Menubar>
      <div className="flex-grow flex mt-2">
        <div className="w-1/2 mr-2">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            className="w-full h-full"
          />
        </div>
        <div className="w-1/2 ml-2">
          <Card>
            <CardContent className="pt-4">
              <MarkdownPreview content={content} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Edit;
