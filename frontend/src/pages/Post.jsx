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

        // Fetch the comments from comments.json
        const commentsResponse = await fetch("/comments.json");
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
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
