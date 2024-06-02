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

const Post = () => {
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  const { fileID } = useParams();

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

    fetchPost();
  }, [fileID]);

  if (!post) {
    return <></>;
  }

  return (
    <>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>{post.fileName}</CardTitle>
          <CardDescription>
            By {post.authorId.name} on {post.dateCreated} | {post.likes} likes{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownPreview content={post.text} />
        </CardContent>
      </Card>
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>Write a comment</CardHeader>
          <CardContent>
            <Textarea></Textarea>
          </CardContent>
          <CardFooter className="justify-end space-x-2  ">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4 mt-4">
          {comments.map((comment, index) => (
            <CommentPost
              key={index}
              comment={comment.comment}
              author={comment.author}
              date={comment.date}
              likes={comment.likes}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Post;
