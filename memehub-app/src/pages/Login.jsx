import LoginAdmin from "./LoginFormAdmin";
import LoginUser from "./LoginUser";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <LoginUser />
        <LoginAdmin />
      </div>
    </div>
  );
};

export default Login;
