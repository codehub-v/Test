import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../apis/base";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(false);

  const [formData, setFormData] = useState({
    identity: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    is_active: true,
    is_staff: false,
  });
  const validateForm = () => {
    const newErrors = {};

    if (!formData.identity.trim()) {
      newErrors.identity = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role.";
    }

    if (!isEdit && !formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchRoles();

    if (isEdit) {
      fetchUser();
    }
  }, [id]);

  const fetchRoles = async () => {
    try {
      const response = await api.get("auth/meta/roles/");
      const data = response.data;

      setRoles(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setRoles([]);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await api.get(`auth/users/${id}/`);

      const user = response.data;

      setFormData({
        identity: user.identity || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        role: user.role || "",
        is_active: user.is_active ?? true,
        is_staff: user.is_staff ?? false,
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        identity: formData.identity.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role || null,
        is_active: formData.is_active,
        is_staff: true,
      };

      if (!isEdit) {
        payload.password = formData.password;
      } else if (formData.password.trim()) {
        payload.password = formData.password;
      }

      if (isEdit) {
        await api.put(`auth/users/${id}/`, payload);
      } else {
        await api.post("auth/users/", payload);
      }

      navigate("/users");
    } catch (error) {
      console.error("Failed to save user:", error);

      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>Loading user...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate("/users")}
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h1 style={styles.title}>{isEdit ? "Edit User" : "Add User"}</h1>

            <p style={styles.subtitle}>
              {isEdit
                ? "Update user information and access"
                : "Create a new system user"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>User Information</h2>
          </div>

          <div style={styles.divider} />

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Name
                <span style={styles.required}>*</span>
              </label>

              <input
                type="text"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                placeholder="Enter name"
                style={{
                  ...styles.input,
                  ...(errors.identity ? styles.inputError : {}),
                }}
              />

              {errors.identity && (
                <span style={styles.errorText}>{errors.identity}</span>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Email
                <span style={styles.required}>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {}),
                }}
              />

              {errors.email && (
                <span style={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Phone
                <span style={styles.required}>*</span>
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                style={{
                  ...styles.input,
                  ...(errors.phone ? styles.inputError : {}),
                }}
                maxLength={10}
              />

              {errors.phone && (
                <span style={styles.errorText}>{errors.phone}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Role
                <span style={styles.required}>*</span>
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors.role ? styles.inputError : {}),
                }}
              >
                <option value="">Select Role</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.identity}
                  </option>
                ))}
              </select>

              {errors.role && (
                <span style={styles.errorText}>{errors.role}</span>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {isEdit ? "New Password" : "Password"}

                {!isEdit && <span style={styles.required}>*</span>}
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  isEdit
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {}),
                }}
                minLength={4}
              />

              {errors.password ? (
                <span style={styles.errorText}>{errors.password}</span>
              ) : isEdit ? (
                <span style={styles.helpText}>
                  Leave blank if you do not want to change the password.
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Account Settings</h2>
          </div>

          <div style={styles.divider} />

          <div style={styles.settings}>
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={styles.checkbox}
              />

              <div>
                <div style={styles.checkboxTitle}>Active</div>

                <div style={styles.checkboxText}>Allow this user to log in</div>
              </div>
            </label>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={() => navigate("/users")}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              ...styles.saveButton,
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
            disabled={saving}
          >
            <Save size={16} />

            {saving ? "Saving..." : isEdit ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "24px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  backButton: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
  },
inputError: {
    borderColor: "#dc2626",
    background: "#fffafa",
},

errorText: {
    fontSize: "11px",
    color: "#dc2626",
    marginTop: "-2px",
},

helpText: {
    fontSize: "11px",
    color: "#94a3b8",
},
  subtitle: {
    margin: "5px 0 0",
    fontSize: "14px",
    color: "#64748b",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    marginBottom: "16px",
    overflow: "hidden",
  },

  cardHeader: {
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
  },

  cardTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 600,
    color: "#0f172a",
  },

  divider: {
    height: "1px",
    background: "#e2e8f0",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
    padding: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#334155",
  },

  required: {
    color: "#dc2626",
    marginLeft: "3px",
  },

  input: {
    width: "100%",
    height: "38px",
    padding: "0 11px",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#0f172a",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },

  helpText: {
    fontSize: "11px",
    color: "#94a3b8",
  },

  settings: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
  },

  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#4f46e5",
    cursor: "pointer",
  },

  checkboxTitle: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#334155",
  },

  checkboxText: {
    marginTop: "3px",
    fontSize: "12px",
    color: "#94a3b8",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },

  cancelButton: {
    height: "38px",
    padding: "0 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    background: "#ffffff",
    color: "#475569",
    fontSize: "13px",
    cursor: "pointer",
  },

  saveButton: {
    height: "38px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    border: "none",
    borderRadius: "7px",
    background: "#4f46e5",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 500,
  },

  loading: {
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    color: "#64748b",
  },
};

export default UserForm;
