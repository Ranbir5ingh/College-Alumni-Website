import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAlumni } from "../store/auth-slice";

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
      <div style={styles.form}>
        <div style={styles.successMessage}>
          <div style={styles.successIcon}>✓</div>
          <h3 style={styles.successTitle}>Registration Successful!</h3>
          <p style={styles.successText}>
            Your registration has been submitted. Please wait for admin
            verification. You will be able to login once your account is
            verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && (
        <div style={styles.error}>
          {error.message || "Registration failed. Please try again."}
        </div>
      )}

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progress,
            width: `${(currentStep / 3) * 100}%`,
          }}
        ></div>
      </div>

      <div style={styles.stepIndicator}>
        Step {currentStep} of 3
      </div>

      <div style={styles.formContent}>
        {currentStep === 1 && (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Create a password (min 6 characters)"
                minLength="6"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Student ID *</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your student ID"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Communication">
                  Electronics & Communication
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="Management">Management</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Degree *</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Degree</option>
                <option value="B.Tech">B.Tech</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="PhD">PhD</option>
                <option value="B.Sc">B.Sc</option>
                <option value="M.Sc">M.Sc</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Batch *</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., 2018-2022"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Graduation Year *</label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., 2022"
                min="1950"
                max="2030"
                required
              />
            </div>
          </>
        )}

        {currentStep === 3 && (
          <div style={styles.reviewSection}>
            <h3 style={styles.reviewTitle}>Review Your Information</h3>
            <div style={styles.reviewGrid}>
              <div style={styles.reviewItem}>
                <span style={styles.reviewLabel}>Degree:</span>
                <span style={styles.reviewValue}>{formData.degree}</span>
              </div>
              <div style={styles.reviewItem}>
                <span style={styles.reviewLabel}>Batch:</span>
                <span style={styles.reviewValue}>{formData.batch}</span>
              </div>
              <div style={styles.reviewItem}>
                <span style={styles.reviewLabel}>Graduation Year:</span>
                <span style={styles.reviewValue}>{formData.graduationYear}</span>
              </div>
            </div>
            <p style={styles.reviewNote}>
              Please review your information carefully. You can complete your profile after registration.
            </p>
          </div>
        )}
      </div>

      <div style={styles.buttonGroup}>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            style={styles.buttonSecondary}
          >
            Previous
          </button>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            style={styles.buttonPrimary}
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            style={{
              ...styles.buttonPrimary,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        )}
      </div>
    </form>
  );
}

const styles = {
  form: {
    padding: "32px",
  },
  progressBar: {
    width: "100%",
    height: "4px",
    backgroundColor: "#e5e7eb",
    borderRadius: "2px",
    marginBottom: "16px",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#2563eb",
    transition: "width 0.3s ease",
  },
  stepIndicator: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "600",
    marginBottom: "24px",
    textAlign: "center",
  },
  formContent: {
    minHeight: "60vh",
    maxHeight: "60vh",
    overflowY: "auto",
    paddingRight: "8px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "24px",
    fontSize: "14px",
  },
  reviewSection: {
    padding: "16px",
  },
  reviewTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "20px",
  },
  reviewGrid: {
    display: "grid",
    gap: "16px",
  },
  reviewItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  reviewLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
  },
  reviewValue: {
    fontSize: "14px",
    color: "#1f2937",
    fontWeight: "500",
  },
  reviewNote: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#eff6ff",
    borderRadius: "6px",
    borderLeft: "3px solid #2563eb",
  },
  successMessage: {
    textAlign: "center",
    padding: "40px 20px",
  },
  successIcon: {
    width: "60px",
    height: "60px",
    backgroundColor: "#10b981",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    margin: "0 auto 20px",
  },
  successTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "12px",
  },
  successText: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
  },
};

export default RegisterForm;