import { useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-5">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin
              ? "Login to access your alumni account"
              : "Register to join our alumni network"}
          </p>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="px-8 py-5 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;