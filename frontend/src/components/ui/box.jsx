import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * box has three classes: folder, files_home, files_community.
 */

const BoxVariants = cva("", {
  variants: {
    variant: {
      folder: "",
      fileCommunity:
        "rounded-lg border-2 shadow-lg grid p-4 grid-rows-2 grid-cols-8 gap-2",
      fileHome: "",
      default:
        "rounded-lg border-2 shadow-lg p-4 grid-rows-2 grid-cols-8 gap-2 bg-red-100",
    },
    size: {
      default: "px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Box = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <div
      className={cn(BoxVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Box.displayName = "Box";

const BoxFileName = React.forwardRef(
  ({ filename, className, ...props }, ref) => (
    <>
      <div
        ref={ref}
        className={cn(
          "col-start-1 col-end-5 row-start-1 row-end-2 border-2 shadow-lg p-1",
          className,
        )}
        {...props}
      >
        <p> {filename} </p>
      </div>
    </>
  ),
);
BoxFileName.displayName = "BoxFileName";

const BoxAuthor = React.forwardRef(({ author, className, ...props }, ref) => (
  <>
    <div
      ref={ref}
      className={cn(
        "col-start-5 col-end-7 row-start-1 row-end-2 border-2 shadow-lg p-1",
        className,
      )}
      {...props}
    >
      <p> {author} </p>
    </div>
  </>
));
BoxAuthor.displayName = "BoxAuthor";

const BoxDate = React.forwardRef(({ date, className, ...props }, ref) => (
  <>
    <div
      ref={ref}
      className={cn(
        "col-start-8 col-end-9 row-start-1 row-end-2 border-2 shadow-lg p-1",
        className,
      )}
      {...props}
    >
      <p> {date} </p>
    </div>
  </>
));
BoxDate.displayName = "BoxDate";

// May combine BoxNumLikes and BoxLike together in one go.
const BoxNumLikes = React.forwardRef(
  ({ numlikes, className, ...props }, ref) => (
    <>
      <div
        ref={ref}
        className={cn(
          "col-start-2 row-start-2 row-end-3 text-right border-2 shadow-lg p-1",
          className,
        )}
        {...props}
      >
        <p> {numlikes} </p>
      </div>
    </>
  ),
);
BoxNumLikes.displayName = "BoxNumLikes";

// Has to import an image as a button and an action.
const BoxLike = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "col-start-3 row-start-2 row-end-3 border-2 shadow-lg p-1",
      className,
    )}
    {...props}
  />
));
BoxLike.displayName = "BoxLike";

const BoxLastComment = React.forwardRef(
  ({ lastComment, className, ...props }, ref) => (
    <>
      <div
        ref={ref}
        className={cn(
          "col-start-5 col-end-9 row-start-2 row-end-3 border-2 shadow-lg p-1",
          className,
        )}
        {...props}
      >
        <p> {lastComment} </p>
      </div>
    </>
  ),
);
BoxLastComment.displayName = "BoxLastComment";

export {
  Box,
  BoxVariants,
  BoxAuthor,
  BoxDate,
  BoxFileName,
  BoxLastComment,
  BoxLike,
  BoxNumLikes,
};
