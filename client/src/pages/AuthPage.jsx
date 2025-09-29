import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={styles.subtitle}>
            {isLogin
              ? "Login to access your alumni account"
              : "Register to join our alumni network"}
          </p>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              style={styles.link}
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

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  header: {
    padding: "32px 32px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },
  footer: {
    padding: "24px 32px",
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "#6b7280",
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AuthPage;