import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  BoxAuthor,
  BoxDate,
  BoxFileName,
  BoxLastComment,
  BoxLike,
  BoxNumLikes,
} from "@/components/ui/box";

import { cn } from "@/lib/utils";

// MainLayout: The fundamental layout housing the two columns (side bar and contents)
// Colspan size is 5 so that sidebar:content ratio would be 1:6
const MainLayout = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full h-screen container mx-auto grid grid-cols-7",
      className,
    )}
    //grid-rows-[auto,1fr,auto]
    {...props}
  />
));
MainLayout.displayName = "MainLayout";

// SideBar: Featured on the left, fixed, narrow
const SideBar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-slate-700 grid-rows-[repeat(auto-fill,minmax(500px,1fr))",
      className,
    )}
    {...props}
  />
));
SideBar.displayName = "SideBar";

// MainBar: Contents.
const MainBar = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("files.json");
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error loading file data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileDoubleClick = (file) => {
    const filePath = `/files/${file.folder}/${file.fileName}`;
    navigate(filePath);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div
        className={cn(
          "rounded-lg border shadow-lg col-span-6 grid-rows-[repeat(auto-fill,minmax(500px,1fr))] space-y-8",
        )}
      >
        {files.map((file) => (
          <Box variant="fileCommunity" key={file._id}>
            <BoxFileName
              fileName={file.fileName}
              onDoubleClick={() => handleFileDoubleClick(file)}
            ></BoxFileName>
            <BoxAuthor author={file.author}></BoxAuthor>
            <BoxDate date={formatDate(file.lastModified)}></BoxDate>
            <BoxNumLikes numlikes="17"></BoxNumLikes>{" "}
            {/*  NEEDS TO BE UPDATED*/}
            <BoxLike> </BoxLike> {/*Replace with an appropriate immage*/}
            <BoxLastComment lastComment="Hello world!"></BoxLastComment>{" "}
            {/*  NEEDS TO BE UPDATED*/}
          </Box>
        ))}
      </div>
    </>
  );
};
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

export { MainLayout, SideBar, MainBar, Box };
