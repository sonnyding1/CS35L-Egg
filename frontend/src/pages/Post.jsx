import { useEffect, useState } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import CommentPost from "@/components/CommentPost";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useAuth } from "@/components/AuthContext";

const Post = () => {
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);

  const { fileID } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch("http://localhost:3000/file/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const filteredData = data.filter((file) => file._id === fileID)[0];
          const dateCreatedString = filteredData.dateCreated;
          filteredData.dateCreated = new Date(
            dateCreatedString,
          ).toLocaleDateString("en-US");
          setPost(filteredData);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setPost(null);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch("http://localhost:3000/file/comment/all", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: fileID }),
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchPost();
    fetchComments();
  }, [fileID]);

  const handleSubmitComment = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/file/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: fileID, content: commentContent }),
          credentials: "include",
        },
      );
      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setCommentContent("");
      } else {
        console.error("Error creating comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>{post.fileName}</CardTitle>
          <CardDescription>
            By {post.authorId.name} on {post.dateCreated}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownPreview content={post.text} />
        </CardContent>
      </Card>
      <div className="max-w-5xl mx-auto">
        {user && (
          <Card>
            <CardHeader>Write a comment</CardHeader>
            <CardContent>
              <Textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              ></Textarea>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSubmitComment}>Submit</Button>
            </CardFooter>
          </Card>
        )}

        <div className="space-y-4 mt-4">
          {comments.map((comment, index) => (
            <CommentPost
              key={index}
              comment={comment.content}
              author={comment.authorId.name}
              date={new Date(comment.dateCreated).toLocaleDateString("en-US")}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Post;
