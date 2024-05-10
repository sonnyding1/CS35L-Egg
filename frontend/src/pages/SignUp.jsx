import LoginForm from "../components/loginform";

function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm isSignUpPage={true} />
    </div>
  );
}

export default SignUp;
