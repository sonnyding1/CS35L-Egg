import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  /*
  return (
    <>
      <Button onClick={() => console.log(userData)}>Log User Data</Button>
    </>
  );
  */

  // Profile Display Begin
  return (
    <div>
      {userData ? (
        <div>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Date Joined:</strong> {new Date(userData.dateCreated).toLocaleString()}</p>
          <p><strong>My Files:</strong></p>
          <ul>
            {userData.files.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
          <p><strong>Liked Files:</strong></p>
          <ul>
            {userData.likedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  // Profile Display End
};

export default Profile;
