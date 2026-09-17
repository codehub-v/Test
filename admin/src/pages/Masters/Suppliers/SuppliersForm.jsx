import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SuppliersForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    identity: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  /* =========================
       Fetch Supplier
    ========================= */

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      setError("");
      setFieldErrors({});

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/master/suppliers/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );

      setFormData({
        identity: response.data.identity || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
        city: response.data.city || "",
        pincode: response.data.pincode || "",
        is_active: response.data.is_active ?? true,
      });
    } catch (error) {
      console.error("Supplier fetch error:", error);

      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSupplier();
    }
  }, [id]);

  /* =========================
       Input Change
    ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) {
      setError("");
    }
  };

  /* =========================
       Status Change
    ========================= */

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  /* =========================
       Submit
    ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});

    const errors = {};

    // Supplier Name
    if (!formData.identity.trim()) {
      errors.identity = "Supplier name is required.";
    }

    // Phone
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid 10 digit phone number.";
    }

    // Email
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Pincode
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Pincode must contain exactly 6 digits.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      setError(Object.values(errors)[0]);

      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (isEdit) {
        await axios.put(
          `http://127.0.0.1:8000/master/suppliers/${id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          },
        );
      } else {
        await axios.post("http://127.0.0.1:8000/master/suppliers/", formData, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      }

      navigate("/suppliers");
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
       API Error
    ========================= */

  const handleApiError = (error) => {
    const responseData = error?.response?.data;

    if (!responseData) {
      setError(
        "Unable to connect to the server. Please check your connection and try again.",
      );

      return;
    }

    if (typeof responseData === "object" && !Array.isArray(responseData)) {
      const errors = {};

      Object.entries(responseData).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          errors[field] = messages.join(" ");
        } else if (typeof messages === "string") {
          errors[field] = messages;
        }
      });

      if (Object.keys(errors).length) {
        setFieldErrors(errors);

        setError(Object.values(errors)[0]);

        return;
      }
    }

    if (responseData.detail) {
      setError(responseData.detail);

      return;
    }

    if (responseData.message) {
      setError(responseData.message);

      return;
    }

    if (responseData.error) {
      setError(responseData.error);

      return;
    }

    setError(
      "Unable to save supplier. Please check the entered information and try again.",
    );
  };

  /* =========================
       Fetch Error Message
    ========================= */

  const getErrorMessage = (error) => {
    if (!error.response) {
      return "Unable to connect to the server. Please try again.";
    }

    const data = error.response.data;

    if (data?.detail) {
      return data.detail;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (error.response.status === 401) {
      return "Your session has expired. Please login again.";
    }

    if (error.response.status === 403) {
      return "You do not have permission to perform this action.";
    }

    if (error.response.status === 404) {
      return "Supplier not found.";
    }

    if (error.response.status >= 500) {
      return "Server error. Please try again later.";
    }

    return "Something went wrong. Please try again.";
  };

  /* =========================
       Loading
    ========================= */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>Loading supplier details...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <button
            onClick={() => navigate(-1)}
            style={styles.backButton}
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2 style={styles.title}>
              {isEdit ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <p style={styles.subtitle}>
              {isEdit ? "Update supplier master data" : "Create a new supplier"}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={styles.card}>
        {/* Supplier Name */}
        <div style={styles.formSection}>
          <label style={styles.label}>
            Supplier Name
            <span style={styles.required}>*</span>
          </label>

          <input
            type="text"
            name="identity"
            value={formData.identity}
            onChange={handleChange}
            placeholder="Enter supplier name"
            style={{
              ...styles.input,
              ...(fieldErrors.identity ? styles.inputError : {}),
            }}
          />

          {fieldErrors.identity && (
            <span style={styles.fieldError}>{fieldErrors.identity}</span>
          )}
        </div>

        {/* Phone + Email */}
        <div style={styles.rowTwo}>
          {/* Phone */}
          <div style={styles.formSection}>
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
              maxLength={10}
              style={{
                ...styles.input,
                ...(fieldErrors.phone ? styles.inputError : {}),
              }}
            />

            {fieldErrors.phone && (
              <span style={styles.fieldError}>{fieldErrors.phone}</span>
            )}
          </div>

          {/* Email */}
          <div style={styles.formSection}>
            <label style={styles.label}>
              Email
              <span style={styles.required}>*</span>
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              style={{
                ...styles.input,
                ...(fieldErrors.email ? styles.inputError : {}),
              }}
            />

            {fieldErrors.email && (
              <span style={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>
        </div>

        {/* Address */}
        <div style={styles.formSection}>
          <label style={styles.label}>Address</label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter supplier address"
            rows={3}
            style={styles.textarea}
          />
        </div>

        {/* City + Pincode */}
        <div style={styles.rowTwo}>
          {/* City */}
          <div style={styles.formSection}>
            <label style={styles.label}>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              style={styles.input}
            />
          </div>

          {/* Pincode */}
          <div style={styles.formSection}>
            <label style={styles.label}>Pincode</label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              maxLength={6}
              style={{
                ...styles.input,
                ...(fieldErrors.pincode ? styles.inputError : {}),
              }}
            />

            {fieldErrors.pincode && (
              <span style={styles.fieldError}>{fieldErrors.pincode}</span>
            )}
          </div>
        </div>

{/* Status */}
<div style={styles.statusSection}>
    <div>
        <p style={styles.statusTitle}>Status</p>

        <p style={styles.statusDescription}>
            Enable or disable this supplier
        </p>
    </div>

    <label style={styles.switch}>
        <input
            type="checkbox"
            checked={formData.is_active}
            onChange={handleStatusChange}
            style={styles.hiddenCheckbox}
        />

        <span
            style={{
                ...styles.slider,
                ...(formData.is_active
                    ? styles.sliderActive
                    : {}),
            }}
        >
            <span
                style={{
                    ...styles.sliderKnob,
                    ...(formData.is_active
                        ? styles.sliderKnobActive
                        : {}),
                }}
            />
        </span>
    </label>
</div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.cancelButton}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.saveButton,
              ...(saving ? styles.disabledButton : {}),
            }}
          >
            <Save size={16} />

            {saving
              ? "Saving..."
              : isEdit
                ? "Update Supplier"
                : "Save Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },

  titleSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  backButton: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#475569",
    cursor: "pointer",
  },

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "650",
    color: "#0f172a",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "14px",
    color: "#64748b",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "12px 14px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontSize: "14px",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
  },

  formSection: {
    padding: "20px 20px 0",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },

  required: {
    marginLeft: "4px",
    color: "#dc2626",
  },

  input: {
    width: "100%",
    height: "40px",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #dbe1ea",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "#ffffff",
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fffafa",
  },

  fieldError: {
    display: "block",
    marginTop: "5px",
    fontSize: "12px",
    color: "#dc2626",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    border: "1px solid #dbe1ea",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "#ffffff",
    resize: "vertical",
    fontFamily: "inherit",
  },

  rowTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  statusSection: {
    margin: "24px 20px 0",
    padding: "18px 0",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statusTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  statusDescription: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },

  switch: {
    position: "relative",
    display: "inline-block",
    width: "44px",
    height: "24px",
    flexShrink: 0,
    cursor: "pointer",
},

hiddenCheckbox: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
},

slider: {
    position: "absolute",
    inset: 0,
    borderRadius: "20px",
    backgroundColor: "#cbd5e1",
    transition: "background-color 0.25s ease",
},

sliderActive: {
    backgroundColor: "#4f46e5",
},

sliderKnob: {
    position: "absolute",
    width: "18px",
    height: "18px",
    left: "3px",
    top: "3px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.25s ease",
},

sliderKnobActive: {
    transform: "translateX(20px)",
},

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "16px 20px",
    borderTop: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },

  cancelButton: {
    height: "40px",
    padding: "0 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },

  saveButton: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "0 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  loadingCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default SuppliersForm;
