import React, { useEffect, useState } from "react";
import { X, Palette, Check } from "lucide-react";

const ColorModal = ({ isOpen, onClose, onSubmit, editingColor }) => {
  const [formData, setFormData] = useState({
    identity: "",
    code: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    identity: "",
    code: "",
  });

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (editingColor) {
      setFormData({
        identity: editingColor.identity || "",
        code: editingColor.code || "",
        is_active: editingColor.is_active ?? true,
      });
    } else {
      setFormData({
        identity: "",
        code: "",
        is_active: true,
      });
    }

    setErrors({
      identity: "",
      code: "",
    });

    setServerError("");
    setSuccessMessage("");
  }, [editingColor, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "identity" || name === "code") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({
      identity: "",
      code: "",
    });

    setServerError("");
    setSuccessMessage("");

    const newErrors = {
      identity: "",
      code: "",
    };

    if (!formData.identity.trim()) {
      newErrors.identity = "Please enter a color name.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Please enter a color code.";
    }

    if (newErrors.identity || newErrors.code) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await onSubmit({
        ...formData,
        identity: formData.identity.trim(),
        code: formData.code.trim(),
      });

      console.log("SUCCESS RESPONSE:", response);

      setSuccessMessage(
        response?.message ||
          (editingColor
            ? "Color updated successfully."
            : "Color created successfully."),
      );

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.log("API ERROR:", error);

      const data = error?.response?.data || error;

      console.log("API ERROR DATA:", data);

      if (data?.code === "DUPLICATE_ENTRY") {
        if (data.field === "identity") {
          setErrors((prev) => ({
            ...prev,
            identity: data.error || "Color name already exists.",
          }));
        }

        if (data.field === "code") {
          setErrors((prev) => ({
            ...prev,
            code: data.error || "Color code already exists.",
          }));
        }

        return;
      }

      if (data?.identity) {
        setErrors((prev) => ({
          ...prev,
          identity: Array.isArray(data.identity)
            ? data.identity[0]
            : data.identity,
        }));
      }

      if (data?.code) {
        setErrors((prev) => ({
          ...prev,
          code: Array.isArray(data.code) ? data.code[0] : data.code,
        }));
      }

      if (data?.error && !data?.identity && !data?.code) {
        setServerError(data.error);
      } else if (data?.detail && !data?.identity && !data?.code) {
        setServerError(data.detail);
      } else if (data?.message && !data?.identity && !data?.code) {
        setServerError(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconBox}>
              <Palette size={21} />
            </div>

            <div>
              <h2 style={styles.title}>
                {editingColor ? "Edit Color" : "Add Color"}
              </h2>

              <p style={styles.subtitle}>
                {editingColor
                  ? "Update the color master details"
                  : "Create a new color in the master"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            disabled={loading}
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={styles.form}>

            {successMessage && (
              <div
                style={{
                  marginBottom: "18px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  color: "#047857",
                  fontSize: "13px",
                }}
              >
                {successMessage}
              </div>
            )}


            {serverError && (
              <div
                style={{
                  marginBottom: "18px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  fontSize: "13px",
                }}
              >
                {serverError}
              </div>
            )}

            {/* Color Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Color Name
                <span style={styles.required}>*</span>
              </label>

              <input
                type="text"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                placeholder="e.g. Red, Navy Blue"
                style={{
                  ...styles.input,
                  ...(errors.identity
                    ? {
                        borderColor: "#ef4444",
                      }
                    : {}),
                }}
              />

              {errors.identity && (
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "12px",
                    color: "#ef4444",
                  }}
                >
                  {errors.identity}
                </div>
              )}
            </div>

            {/* Color Code */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Color Code
                <span style={styles.required}>*</span>
              </label>

              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. RED001"
                style={{
                  ...styles.input,
                  ...(errors.code
                    ? {
                        borderColor: "#ef4444",
                      }
                    : {}),
                }}
              />

              {errors.code && (
                <div
                  style={{
                    marginTop: "5px",
                    fontSize: "12px",
                    color: "#ef4444",
                  }}
                >
                  {errors.code}
                </div>
              )}
            </div>

            {/* Status */}
            <div style={styles.statusBox}>
              <div>
                <div style={styles.statusTitle}>Status</div>

                <div style={styles.statusDescription}>
                  {formData.is_active
                    ? "This color is currently active"
                    : "This color is currently inactive"}
                </div>
              </div>

              <label style={styles.toggle}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  style={styles.hiddenCheckbox}
                  disabled={loading}
                />

                <span
                  style={{
                    ...styles.slider,
                    backgroundColor: formData.is_active ? "#4f46e5" : "#cbd5e1",
                  }}
                >
                  <span
                    style={{
                      ...styles.sliderCircle,
                      transform: formData.is_active
                        ? "translateX(20px)"
                        : "translateX(0)",
                    }}
                  >
                    {formData.is_active && <Check size={11} color="#4f46e5" />}
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "Saving..."
                : editingColor
                  ? "Update Color"
                  : "Create Color"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modal: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 25px 60px rgba(15, 23, 42, 0.18)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 22px",
    borderBottom: "1px solid #eef2f7",
    backgroundColor: "#ffffff",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  iconBox: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
  },

  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "650",
    color: "#0f172a",
    lineHeight: "1.3",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "12.5px",
    color: "#64748b",
  },

  closeButton: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    cursor: "pointer",
  },

  form: {
    padding: "22px",
  },

  formGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },

  required: {
    marginLeft: "3px",
    color: "#ef4444",
  },

input: {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    padding: "0 12px",

    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#dbe1ea",

    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "14px",
    transition: "border-color 0.2s ease",
},

  statusBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 15px",
    marginTop: "4px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
  },

  statusTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },

  statusDescription: {
    marginTop: "3px",
    fontSize: "12px",
    color: "#64748b",
  },

  toggle: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
  },

  hiddenCheckbox: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },

  slider: {
    width: "42px",
    height: "23px",
    borderRadius: "20px",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.2s ease",
    boxSizing: "border-box",
  },

  sliderCircle: {
    width: "19px",
    height: "19px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "16px 22px",
    borderTop: "1px solid #eef2f7",
    backgroundColor: "#fafbfc",
  },

  cancelButton: {
    height: "38px",
    padding: "0 16px",
    border: "1px solid #dbe1ea",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },

  submitButton: {
    height: "38px",
    padding: "0 18px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    boxShadow: "0 2px 5px rgba(79, 70, 229, 0.25)",
  },
};

export default ColorModal;
