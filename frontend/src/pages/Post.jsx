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
import { Toggle } from "@/components/ui/toggle";

const Post = () => {
  const [post, setPost] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

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

    const fetchLiked = async () => {
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
          const data = await response.json();
          const isFileIdLiked = data.likedFiles.some(
            (likedFile) => likedFile._id === fileID,
          );
          setIsLiked(isFileIdLiked);
        } else {
          console.error("Error fetching liked files:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching liked files:", error);
      }
    };

    fetchPost();
    fetchComments();
    fetchLiked();
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

  const handleLike = async () => {
    try {
      const response = isLiked
        ? await fetch("http://localhost:3000/file/user-liked/remove", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: fileID }),
            credentials: "include",
          })
        : await fetch("http://localhost:3000/file/user-liked/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: fileID }),
            credentials: "include",
          });

      if (response.ok) {
        setIsLiked(!isLiked);
      } else {
        console.error("Error updating like status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  if (!post) {
    return <NotFoundPage />;
  }

  return (
    <div className="px-16">
      <Card className="m-4">
        <CardHeader>
          <CardTitle>
            {post.fileName}
            {user && (
              <Toggle
                variant="outline"
                aria-label="Toggle Like"
                className="ml-4"
                onPressedChange={handleLike}
                pressed={isLiked}
              >
                👍
              </Toggle>
            )}
          </CardTitle>
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
    </div>
  );
};

export default Post;
