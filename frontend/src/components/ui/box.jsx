import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
          "col-start-1 col-end-5 row-start-1 row-end-2 p-1 rounded-large border-b-2",
          className,
        )}
        {...props}
      >
        <p className="font-bold"> {filename} </p>
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
        "col-start-5 col-end-7 row-start-1 row-end-2 p-1",
        className,
      )}
      {...props}
    >
      <p className="text-slate-400"> By {author} </p>
    </div>
  </>
));
BoxAuthor.displayName = "BoxAuthor";

const BoxDate = React.forwardRef(({ date, className, ...props }, ref) => (
  <>
    <div
      ref={ref}
      className={cn(
        "col-start-8 col-end-9 row-start-1 row-end-2  p-1",
        className,
      )}
      {...props}
    >
      <p className="text-slate-400"> {date} </p>
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
          "col-start-1 row-start-2 row-end-3 text-center p-1",
          className,
        )}
        {...props}
      >
        <div className>
          <p> {numlikes} </p>
        </div>
      </div>
    </>
  ),
);
BoxNumLikes.displayName = "BoxNumLikes";

// Has to import an image as a button and an action.
const BoxLike = React.forwardRef(({ isLiked, className, ...props }, ref) => (
  <>
    {(() => {
      // if (!exists){
      //   return;
      // }
      if (isLiked) {
        return (
          <div
            ref={ref}
            className={cn("col-start-1 row-start-2 row-end-3 p-1", className)}
            {...props}
          >
            <Button
              variant="LikedButton"
              size="none"
              aria-label="Like"
            ></Button>
          </div>
        );
      } else {
        return (
          <div
            ref={ref}
            className={cn("col-start-1 row-start-2 row-end-3 p-1", className)}
            {...props}
          >
            <Button
              variant="NotLikedButton"
              size="none"
              aria-label="Like"
            ></Button>
          </div>
        );
      }
    })()}
  </>
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
        <p className="text-xs"> {lastComment} </p>
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
