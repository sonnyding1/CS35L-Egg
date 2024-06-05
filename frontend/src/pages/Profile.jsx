import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileList from "./FileList";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Profile = () => {
  const { usernameURL } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: usernameURL }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserData();
  }, [usernameURL]);

  const handleEditProfile = async (event) => {
    const name = event.target.elements.newName.value;
    try {
      const response = await fetch("http://localhost:3000/user/edit-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: name }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Profile Display
  return (
    <div className="p-8">
      {userData ? (
        <div>
          <div className="relative border p-4 rounded-sm mb-12">
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Date Joined:</strong>{" "}
              {new Date(userData.dateCreated).toLocaleString()}
            </p>
            <div className="absolute top-2 right-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEditProfile}>
                    <div className="flex w-full items-center space-x-2">
                      <Input
                        type="text"
                        name="newName"
                        placeholder="Enter a new name"
                      />
                      <Button type="submit">Save</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <FileList files={userData.files} />
        </div>
      ) : (
        <div className="flex items-center text-center justify-center h-screen">
          Loading...
        </div>
      )}
    </div>
  );
};

export default Profile;
