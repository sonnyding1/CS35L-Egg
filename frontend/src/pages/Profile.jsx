import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileList from "./FileList";

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
    <div>
      {userData ? (
        <div>
          <p style={{ fontSize: "1.5rem" }}><strong>Username:</strong> {userData.username}</p>
          <p style={{ fontSize: "1.5rem" }}><strong>Email:</strong> {userData.email}</p>
          <p style={{ fontSize: "1.5rem" }}><strong>Date Joined:</strong> {new Date(userData.dateCreated).toLocaleString()}</p>
          <FileList files={userData.files} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

};

export default Profile;
