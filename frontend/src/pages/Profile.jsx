import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileList from "./FileList";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

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
              <Button variant="outline" size="icon">
                <Edit />
              </Button>
            </div>
          </div>
          <FileList files={userData.files} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Profile;
