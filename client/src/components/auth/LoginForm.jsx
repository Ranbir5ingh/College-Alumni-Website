import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAlumni } from "@/store/auth-slice";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAlumni(formData));
    
    if (result.type === "auth/login/fulfilled") {
      const user = result.payload.user;
      
      // Redirect based on account status
      if (user.accountStatus === "incomplete_profile") {
        navigate("/complete-profile");
      } else if (user.accountStatus === "pending_verification") {
        navigate("/verification-pending");
      } else if (user.accountStatus === "verified") {
        navigate("/dashboard");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm">
          {error.message || "Login failed. Please try again."}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-2.5 text-base font-semibold border-0 rounded-md transition-colors ${
          isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;