// import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@/components/ui/box";

import { ThumbsUp } from "lucide-react";

// MainLayout: The fundamental layout housing the two columns (side bar and contents)
// Colspan size is 5 so that sidebar:content ratio would be 1:6
// const MainLayout = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "w-full h-screen container mx-auto grid grid-cols-7",
//       className,
//     )}
//     //grid-rows-[auto,1fr,auto]
//     {...props}
//   />
// ));
// MainLayout.displayName = "MainLayout";

// // SideBar: Featured on the left, fixed, narrow
// const SideBar = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "bg-slate-700 grid-rows-[repeat(auto-fill,minmax(500px,1fr))",
//       className,
//     )}
//     {...props}
//   />
// ));
// SideBar.displayName = "SideBar";

// MainBar: Contents.
const MainBar = () => {
  const [files, setFiles] = useState([]);
  // const [likedFiles, setLikedFiles] = useState([]);
  const [fileComments, setFileComments] = useState({}); // State to store comments for each file

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filesResponse = await fetch("http://localhost:3000/file/all", {
          method: "GET",
        });

        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          setFiles(filesData);

          // Fetch comments for each file
          const commentsData = await Promise.all(
            filesData.map(async (file) => {
              const response = await fetch(
                "http://localhost:3000/file/comment/all",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ _id: file._id }),
                },
              );
              // Printing the file id values
              console.log("file id: ", file._id);
              console.log(response);

              if (response.ok) {
                const data = await response.json();
                console.log("comment: ", data);
                return { fileId: file._id, comments: data };
              } else {
                console.error("Error fetching comments for file:", file._id);
                return { fileId: file._id, comments: [] };
              }
            }),
          );

          // Convert commentsData array to a map for easier access
          const commentsMap = commentsData.reduce(
            (acc, { fileId, comments }) => {
              acc[fileId] = comments;
              return acc;
            },
            {},
          );
          setFileComments(commentsMap);
        }

        // if (likedResponse.ok) {
        //   const likedData = await likedResponse.json();
        //   setLikedFiles(likedData.likedFiles);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const handleFileDoubleClick = (id) => {
  //   navigate("/edit", { state: { fileId: id } });
  // };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getMostRecentComment = (fileId) => {
    const fileCommentsArray = fileComments[fileId] || [];
    if (fileCommentsArray.length === 0) return null;
    return fileCommentsArray.reduce((latest, current) => {
      return new Date(latest.dateCreated) > new Date(current.dateCreated)
        ? latest
        : current;
    });
  };

  //** Handling like Buttons
  //*
  //* handleLike: handling the like button. Checks with the backend to see if it's liked
  //*             and if it isn't, like it. If it is, unlike it.
  //*
  //*

  /* const handleLike = async (fileId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/file/user-liked/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ _id: fileId }),
        },
      );

      if (!response.ok) {
        console.error("Error liking file:", response.statusText);
        return;
      }

      const likedFile = await response.json();
      setLikedFiles((prevLikedFiles) => [...prevLikedFiles, likedFile]);
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === fileId
            ? { ...file, likesCount: (file.likeCount || 0) + 1 }
            : file,
        ),
      );
    } catch (error) {
      console.error("Error liking file:", error);
    }
  };
  

  const handleUnlike = async (fileId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/file/user-liked/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ _id: fileId }),
        },
      );

      if (!response.ok) {
        console.error("Error unliking file:", response.statusText);
        return;
      }

      // const unlikedFile = await response.json();
      setLikedFiles((prevLikedFiles) =>
        prevLikedFiles.filter((likedFile) => likedFile._id !== fileId),
      );
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === fileId
            ? { ...file, likesCount: (file.likeCount || 0) - 1 }
            : file,
        ),
      );
    } catch (error) {
      console.error("Error unliking file:", error);
    }
  }; */

  return (
    <>
      <div className="w-full container space-y-8 p-4">
        {files.map((file) => {
          if (
            file.public &&
            file.authorId &&
            typeof file.authorId === "object" &&
            file.authorId.username
          ) {
            const mostRecentComment = getMostRecentComment(file._id);
            // const likeCount = likedFiles.filter(
            //   (likedFile) => likedFile._id === file._id,
            // ).length;
            // const isLiked = likedFiles.some(
            //   (likedFile) => likedFile._id === file._id,
            // );
            // const fileName = String(file.fileName);
            // console.log("file details: ", file);

            // checks for the author
            //console.log("file name: ", fileName);
            //console.log("check: ",file.authorId);

            // const author =
            //   file.authorId &&
            //   typeof file.authorId === "object" &&
            //   file.authorId.username
            //     ? file.authorId.username
            //     : "Unknown Author";

            return (
              <div key={file._id}>
                <div
                  className="grid grid-cols-4 border rounded-sm p-4 transform transition duration-500 ease-in-out hover:scale-[1.02] hover:shadow-lg space-x-16 cursor-pointer"
                  onClick={() => {
                    navigate("/posts/" + file._id);
                  }}
                >
                  <div className="col-span-1">
                    <div className="font-bold">{file.fileName}</div>
                  </div>
                  <div className="col-span-1">
                    <div>Author: {file.authorId.name}</div>
                    <div>Date: {formatDate(file.lastModified)}</div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp size={16} /> <div>{file.likeCount}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div>Latest comment: </div>
                    <div className="border rounded-sm py-1 px-4">
                      {mostRecentComment
                        ? mostRecentComment.content
                        : "No comments yet"}
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </>
  );
};

export default MainBar;

//MainBar.displayName = "MainBar";

// Box
// const Box = React.forwardRef(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("rounded-lg border shadow-lg p-4 margin-8", className)}
//     {...props}
//   />
// ));
// Box.displayName = "Box";

export { MainBar, Box };

{
  /* <div
        className={cn(
          "rounded-lg border shadow-lg col-span-6 grid-rows-[repeat(auto-fill,minmax(500px,1fr))] space-y-8"
        )} */
}
