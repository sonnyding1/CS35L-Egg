import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Menubar } from "@/components/ui/menubar";
import EditMenuBar from "@/components/EditMenuBarMenu";
import FileMenuBarMenu from "@/components/FileMenuBarMenu";
import MarkdownPreview from "@/components/MarkdownPreview";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function Edit() {
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isFilePublic, setFilePublic] = useState(false);
  const [isFileNameDialogOpen, setFileNameDialogOpen] = useState(false);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [fileId, setFileId] = useState(null);

  const timeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileContent = async () => {
      const fetchedFileId = location.state?.fileId;
      setFileId(fetchedFileId);
      if (!fetchedFileId) {
        // Handle case when fileId is not available
        console.error("File ID not found", fetchedFileId);
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
          body: JSON.stringify({ _id: fetchedFileId }),
        });

        if (response.ok) {
          const data = await response.json();
          setFileName(data[0].fileName);
          setContent(data[0].text);
          setFilePublic(data[0].public);
          setPast([
            {
              content: data[0].text,
              cursorStart: data[0].text.length,
              cursorEnd: data[0].text.length,
            },
          ]);
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
      const cursorStart = textareaRef.current.selectionStart;
      const cursorEnd = textareaRef.current.selectionEnd;
      setPast([...past, { content: e.target.value, cursorStart, cursorEnd }]);
      setFuture([]);
    }, 500);
  };

  const onContentChange = (newContent) => {
    setContent(newContent);
    const cursorStart = textareaRef.current.selectionStart;
    const cursorEnd = textareaRef.current.selectionEnd;
    setPast([...past, { content: newContent, cursorStart, cursorEnd }]);
    setFuture([]);
  };

  const setSonnerMessage = (message) => {
    toast(message);
  };

  return (
    <div className="mx-auto px-4 py-4 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <Button variant="outline" onClick={() => navigate("/browse")}>
            Browse
          </Button>
        </div>
        <Button variant="link" onClick={() => setFileNameDialogOpen(true)}>
          {fileName}
        </Button>
        <Button
          onClick={() => {
            navigate("/posts/" + fileId);
          }}
          disabled={!isFilePublic}
        >
          View Post
        </Button>
      </div>
      <Menubar className="mb-2">
        <FileMenuBarMenu
          fileID={fileId}
          fileName={fileName}
          onFileNameChange={setFileName}
          onContentChange={setContent}
          isFileNameDialogOpen={isFileNameDialogOpen}
          setFileNameDialogOpen={setFileNameDialogOpen}
          content={content}
          isFilePublic={isFilePublic}
          setFilePublic={setFilePublic}
          setSonnerMessage={setSonnerMessage}
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
      <Toaster />
    </div>
  );
}

export default Edit;
