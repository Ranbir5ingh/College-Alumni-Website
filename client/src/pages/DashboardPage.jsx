import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAlumni } from "../store/auth-slice";

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAlumni());
    navigate("/");
  };

  const handleCompleteProfile = () => {
    navigate("/profile");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Alumni Dashboard</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.welcomeCard}>
          <h2 style={styles.welcomeTitle}>
            Welcome, {user?.firstName} {user?.lastName}!
          </h2>
          <p style={styles.welcomeText}>
            {user?.isVerified
              ? "Your account is verified and active."
              : "Your account is pending verification. Please wait for admin approval."}
          </p>

          {user?.isVerified && user?.alumniId && (
            <div style={styles.alumniIdBadge}>
              <span style={styles.badgeLabel}>Alumni ID:</span>
              <span style={styles.badgeValue}>{user.alumniId}</span>
            </div>
          )}
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Account Status</h3>
            <div style={styles.statusBadge}>
              {user?.membershipStatus === "active" && (
                <span style={styles.statusActive}>Active</span>
              )}
              {user?.membershipStatus === "pending" && (
                <span style={styles.statusPending}>Pending</span>
              )}
              {user?.membershipStatus === "inactive" && (
                <span style={styles.statusInactive}>Inactive</span>
              )}
            </div>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Your Details</h3>
            <div style={styles.detailsList}>
              <p style={styles.detailItem}>
                <strong>Email:</strong> {user?.email}
              </p>
              <p style={styles.detailItem}>
                <strong>Batch:</strong> {user?.batch}
              </p>
              <p style={styles.detailItem}>
                <strong>Department:</strong> {user?.department}
              </p>
              <p style={styles.detailItem}>
                <strong>Degree:</strong> {user?.degree}
              </p>
            </div>
          </div>
        </div>

        <div style={styles.actionCard}>
          <h3 style={styles.actionTitle}>Complete Your Profile</h3>
          <p style={styles.actionText}>
            Add more information to your profile to connect with other alumni and
            access all features.
          </p>
          <button
            style={styles.actionButton}
            onClick={handleCompleteProfile}
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
  },
  header: {
    backgroundColor: "white",
    padding: "24px 40px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  welcomeCard: {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    marginBottom: "32px",
  },
  welcomeTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "12px",
  },
  welcomeText: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "16px",
  },
  alumniIdBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#dbeafe",
    padding: "8px 16px",
    borderRadius: "20px",
  },
  badgeLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e40af",
  },
  badgeValue: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  infoCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
  },
  statusBadge: {
    display: "inline-block",
  },
  statusActive: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "6px 16px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "600",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    padding: "6px 16px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "600",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "6px 16px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "600",
  },
  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  detailItem: {
    fontSize: "14px",
    color: "#4b5563",
  },
  actionCard: {
    backgroundColor: "#eff6ff",
    padding: "32px",
    borderRadius: "12px",
    border: "2px solid #dbeafe",
    textAlign: "center",
  },
  actionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "12px",
  },
  actionText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "20px",
  },
  actionButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 32px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default DashboardPage;