import LoginForm from "../components/LoginForm";

function SignUp() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      <LoginForm isSignUpPage={true} />
    </div>
  );
}

export default SignUp;
