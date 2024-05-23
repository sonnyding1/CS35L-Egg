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

const Post = () => {
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch("/post.json");
        const data = await response.json();
        setPost(data);

        // Fetch the markdown content from the specified file path
        const contentResponse = await fetch(`/${data.filepath}`);
        const contentData = await contentResponse.text();
        setContent(contentData);
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
            By {post.author} on {post.date}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownPreview content={content} />
        </CardContent>
      </Card>
    </>
  );
};

export default Post;
