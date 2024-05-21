import LoginForm from "../components/loginform";

function Login() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: "100vh" }}
    >
      <LoginForm isSignUpPage={false} />
    </div>
  );
}

export default Login;
