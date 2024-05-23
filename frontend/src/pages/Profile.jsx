import ContentPreview from "@/components/contentpreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";

// TODO: Fix this for backend
function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("./user001/profile.json");
        const data = await response.json();
        setProfileData(data);
        const contentResponse = await fetch(`./${data.previewfile}`);
        const contentData = await contentResponse.text();
        setContent(contentData);
        const commentResponse = await fetch('./user001/comments.json');
        const commentData = await commentResponse.json();
        setComments(commentData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
  
    fetchData();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row m-4">
      <div className="w-1/2 mr-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{profileData.name}</CardTitle>
            <CardDescription>{profileData.bio}</CardDescription>
          </CardHeader>
          <CardContent>
          <Card className="m-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.user}</TableCell>
                    <TableCell>{comment.filename}</TableCell>
                    <TableCell>{comment.comment}</TableCell>
                    <TableCell className="text-right">{comment.likes} <Toggle className="h-7 px-2" variant="outline">👍</Toggle></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          </CardContent>
        </Card>
      </div>
      <div className="w-1/2 ml-2">
        <ContentPreview content={content} />
      </div>
    </div>
  );
}

export default Profile;