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

  return (
    <>
      <Button onClick={() => console.log(userData)}>Log User Data</Button>
    </>
  );
};

export default Profile;
