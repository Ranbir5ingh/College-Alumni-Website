import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAlumni } from "../store/auth-slice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function RegisterForm() {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    studentId: "",
    batch: "",
    graduationYear: "",
    department: "",
    degree: "",
    phone: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerAlumni(formData));
    if (result.type === "auth/register/fulfilled") {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="px-8 py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex justify-center items-center text-3xl mx-auto mb-5">
            ✓
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Registration Successful!
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
            Your registration has been submitted. Please wait for admin
            verification. You will be able to login once your account is
            verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm">
          {error.message || "Registration failed. Please try again."}
        </div>
      )}

      <div className="w-full h-1 bg-gray-200 rounded-sm mb-3 overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      <div className="text-sm text-gray-600 font-semibold mb-5 text-center">
        Step {currentStep} of 3
      </div>

      <div className="max-h-[55vh] overflow-y-auto pr-2">
        {currentStep === 1 && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Min 6 characters"
                minLength="6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Student ID *
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Enter your student ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Department *
              </label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electronics & Communication">
                    Electronics & Communication
                  </SelectItem>
                  <SelectItem value="Mechanical Engineering">
                    Mechanical Engineering
                  </SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  <SelectItem value="Electrical Engineering">
                    Electrical Engineering
                  </SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Degree *
              </label>
              <Select
                value={formData.degree}
                onValueChange={(value) => handleSelectChange("degree", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="B.Sc">B.Sc</SelectItem>
                  <SelectItem value="M.Sc">M.Sc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Batch *
              </label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="e.g., 2018-2022"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Graduation Year *
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="e.g., 2022"
                min="1950"
                max="2030"
                required
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Review Your Information
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Name:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Email:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.email}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Student ID:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.studentId}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Phone:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.phone}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Department:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.department}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Degree:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.degree}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Batch:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.batch}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Graduation Year:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.graduationYear}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3 p-2.5 bg-blue-50 rounded-md border-l-4 border-blue-600">
              Please review your information carefully. You can complete your profile after registration.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 text-base font-semibold border-0 rounded-md cursor-pointer transition-colors hover:bg-gray-200"
          >
            Previous
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-2.5 text-base font-semibold border-0 rounded-md cursor-pointer transition-colors hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className={`flex-1 py-2.5 text-base font-semibold border-0 rounded-md transition-colors ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        )}
      </div>
    </form>
  );
}

export default RegisterForm;