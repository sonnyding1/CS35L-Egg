const CommentPost = ({ comment, author, date }) => {
  return (
    <>
      <div className="p-4 border rounded-lg">
        <p className="text-gray-500">
          {author} on {date}
        </p>
        <p>{comment}</p>
      </div>
    </>
  );
};

export default CommentPost;
