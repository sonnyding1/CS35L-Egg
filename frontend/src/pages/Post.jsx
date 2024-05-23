import React, { useEffect, useState } from "react";
import MarkdownPreview from "@/components/MarkdownPreview";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommentPost from "@/components/CommentPost";

const Post = () => {
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch("/post.json");
        const data = await response.json();
        setPost(data);

        const contentResponse = await fetch(`/${data.filepath}`);
        const contentData = await contentResponse.text();
        setContent(contentData);

        // Fetch the comments from comments.json
        const commentsResponse = await fetch("/comments.json");
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, []);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Card className="m-4">
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <CardDescription>
            By {post.author} on {post.date} | {post.likes} likes{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownPreview content={content} />
        </CardContent>
      </Card>
      <div className="max-w-5xl mx-auto">
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
    </>
  );
};

export default Post;
