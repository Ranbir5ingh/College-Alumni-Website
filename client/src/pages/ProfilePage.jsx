import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAlumni } from "../store/auth-slice";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAlumni());
    navigate("/");
  };

  // Show loading only on initial load when we have no user data
  if (!user && isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // If no user data at all, redirect to login
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <div style={styles.headerButtons}>
          <button
            style={styles.dashboardButton}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.profileCard}>
          <div style={styles.profileHeader}>
            <div style={styles.avatarCircle}>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div>
              <h2 style={styles.profileName}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p style={styles.profileEmail}>{user?.email}</p>
              {user?.alumniId && (
                <p style={styles.profileAlumniId}>ID: {user.alumniId}</p>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Phone:</span>
                <span style={styles.infoValue}>{user?.phone || "Not provided"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Date of Birth:</span>
                <span style={styles.infoValue}>
                  {user?.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Gender:</span>
                <span style={styles.infoValue}>{user?.gender || "Not provided"}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Blood Group:</span>
                <span style={styles.infoValue}>
                  {user?.bloodGroup || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Academic Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Student ID:</span>
                <span style={styles.infoValue}>{user?.studentId}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Batch:</span>
                <span style={styles.infoValue}>{user?.batch}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Graduation Year:</span>
                <span style={styles.infoValue}>{user?.graduationYear}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Department:</span>
                <span style={styles.infoValue}>{user?.department}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Degree:</span>
                <span style={styles.infoValue}>{user?.degree}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>CGPA:</span>
                <span style={styles.infoValue}>{user?.cgpa || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Professional Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Current Company:</span>
                <span style={styles.infoValue}>
                  {user?.currentCompany || "Not provided"}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Current Position:</span>
                <span style={styles.infoValue}>
                  {user?.currentPosition || "Not provided"}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>LinkedIn:</span>
                <span style={styles.infoValue}>
                  {user?.linkedinProfile || "Not provided"}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>GitHub:</span>
                <span style={styles.infoValue}>
                  {user?.githubProfile || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {user?.bio && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Bio</h3>
              <p style={styles.bioText}>{user.bio}</p>
            </div>
          )}

          {user?.skills && user.skills.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Skills</h3>
              <div style={styles.skillsContainer}>
                {user.skills.map((skill, index) => (
                  <span key={index} style={styles.skillBadge}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={styles.editNote}>
            <p style={styles.editNoteText}>
              💡 Complete profile editing feature will be available soon. Contact
              admin to update your profile information.
            </p>
          </div>
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
  headerButtons: {
    display: "flex",
    gap: "12px",
  },
  dashboardButton: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    padding: "32px",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    paddingBottom: "24px",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "32px",
  },
  avatarCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    fontWeight: "bold",
  },
  profileName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "4px",
  },
  profileEmail: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  profileAlumniId: {
    fontSize: "13px",
    color: "#2563eb",
    fontWeight: "600",
  },
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
  },
  infoValue: {
    fontSize: "14px",
    color: "#1f2937",
  },
  bioText: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.6",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillBadge: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "13px",
    fontWeight: "500",
  },
  editNote: {
    backgroundColor: "#eff6ff",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #dbeafe",
  },
  editNoteText: {
    fontSize: "14px",
    color: "#1e40af",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    gap: "16px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #e0e0e0",
    borderTop: "5px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  errorText: {
    fontSize: "16px",
    color: "#ef4444",
    marginBottom: "20px",
  },
  retryButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProfilePage;