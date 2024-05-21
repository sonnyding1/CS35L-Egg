import LoginForm from "../components/loginform";

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
