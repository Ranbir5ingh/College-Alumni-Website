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
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    enrollmentNumber: "",
    batch: "",
    yearOfJoining: "",
    yearOfPassing: "",
    department: "",
    degree: "",
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

  // --- UPDATED handleNext FUNCTION WITH VALIDATION ---
  const handleNext = () => {
    // 1. Define required fields for each step
    const requiredFieldsStep1 = ["firstName", "lastName", "email", "password"];
    const requiredFieldsStep2 = [
      "enrollmentNumber",
      "department",
      "degree",
      "batch",
      "yearOfJoining",
      "yearOfPassing",
    ];

    // 2. Determine which fields to validate based on currentStep
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = requiredFieldsStep1;
    } else if (currentStep === 2) {
      fieldsToValidate = requiredFieldsStep2;
    }

    // 3. Check for empty required fields
    const isValid = fieldsToValidate.every((field) => !!formData[field]);

    if (!isValid) {
      // Alert the user and prevent proceeding
      alert("Please fill out all required fields marked with * before proceeding.");
      return; 
    }
    
    // Additional validation for year fields (optional but good practice)
    if (currentStep === 2) {
      const joining = parseInt(formData.yearOfJoining);
      const passing = parseInt(formData.yearOfPassing);
      if (isNaN(joining) || isNaN(passing) || joining > passing) {
        alert("Please ensure 'Year of Joining' and 'Year of Passing' are valid years, and joining year is not after passing year.");
        return;
      }
    }


    // 4. If valid, proceed to the next step
    setCurrentStep(currentStep + 1);
  };
  // ---------------------------------------------------

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
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-4">
            Your basic registration has been completed. Please login and complete your profile to request verification.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800 font-semibold">Next Steps:</p>
            <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
              <li>Login with your credentials</li>
              <li>Complete your profile</li>
              <li>Request verification</li>
              <li>Wait for admin approval</li>
            </ol>
          </div>
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
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Optional"
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

            <div>
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

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Minimum 6 characters"
                minLength="6"
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Enrollment Number *
              </label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="Enter your enrollment number"
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
                Year of Joining *
              </label>
              <input
                type="number"
                name="yearOfJoining"
                value={formData.yearOfJoining}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none transition-colors focus:border-blue-500"
                placeholder="e.g., 2018"
                min="1950"
                max="2030"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Year of Passing *
              </label>
              <input
                type="number"
                name="yearOfPassing"
                value={formData.yearOfPassing}
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
                  {formData.firstName} {formData.middleName} {formData.lastName}
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
                  Enrollment No / College Roll No:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.enrollmentNumber}
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
                  Year of Joining:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.yearOfJoining}
                </span>
              </div>
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">
                  Year of Passing:
                </span>
                <span className="text-sm text-gray-800 font-medium">
                  {formData.yearOfPassing}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3 p-2.5 bg-blue-50 rounded-md border-l-4 border-blue-600">
              This is basic registration. After logging in, you'll need to complete your profile and request verification from admin.
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
            type="button" // Ensures this button does NOT submit the form
            onClick={handleNext}
            className="flex-1 bg-blue-600 text-white py-2.5 text-base font-semibold border-0 rounded-md cursor-pointer transition-colors hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="submit" // Ensures this button DOES submit the form
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