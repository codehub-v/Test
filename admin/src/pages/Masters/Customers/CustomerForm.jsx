
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const CustomerForm = () => {
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

  // General error
  const [error, setError] = useState("");

  // Field-wise errors
  const [fieldErrors, setFieldErrors] = useState({});


  /* =========================
     Fetch Customer
  ========================= */

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError("");
      setFieldErrors({});

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://127.0.0.1:8000/master/customers/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setFormData({
        identity: response.data.identity || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
        city: response.data.city || "",
        pincode: response.data.pincode || "",
        is_active:
          response.data.is_active ?? true,
      });

    } catch (error) {
      console.error(
        "Customer fetch error:",
        error
      );

      setError(
        getErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchCustomer();
    }
  }, [id]);


  /* =========================
     Input Change
  ========================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
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

    // Frontend validation
    const errors = {};

    if (!formData.identity.trim()) {
      errors.identity =
        "Customer name is required.";
    }

    if (!formData.phone.trim()) {
      errors.phone =
        "Phone number is required.";
    }

    if (formData.email && !isValidEmail(formData.email)) {
      errors.email =
        "Please enter a valid email address.";
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone =
        "Please enter a valid phone number.";
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      errors.pincode =
        "Pincode must contain exactly 6 digits.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      let response;

      if (isEdit) {
        // Update
        response = await axios.put(
          `http://127.0.0.1:8000/master/customers/${id}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      } else {
        // Create
        response = await axios.post(
          "http://127.0.0.1:8000/master/customers/",
          formData,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      }

      console.log(
        "Customer saved:",
        response.data
      );

      navigate("/customers");

    } catch (error) {
      console.error(
        "Customer save error:",
        error
      );

      handleApiError(error);

    } finally {
      setSaving(false);
    }
  };


  /* =========================
     API Error Handler
  ========================= */

  const handleApiError = (error) => {
    const responseData =
      error?.response?.data;

    if (!responseData) {
      setError(
        "Unable to connect to the server. Please check your internet connection and try again."
      );
      return;
    }

    // DRF field validation errors
    if (
      typeof responseData === "object" &&
      !Array.isArray(responseData)
    ) {
      const errors = {};

      Object.entries(responseData).forEach(
        ([field, messages]) => {
          if (Array.isArray(messages)) {
            errors[field] =
              messages.join(" ");
          } else if (
            typeof messages === "string"
          ) {
            errors[field] = messages;
          }
        }
      );

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);

        // Show first error at top
        const firstError =
          Object.values(errors)[0];

        setError(firstError);
        return;
      }
    }

    // Detail response
    if (responseData.detail) {
      setError(responseData.detail);
      return;
    }

    // Message response
    if (responseData.message) {
      setError(responseData.message);
      return;
    }

    // Error response
    if (responseData.error) {
      setError(responseData.error);
      return;
    }

    setError(
      "Unable to save customer. Please check the entered information and try again."
    );
  };


  /* =========================
     Error Message
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
      return "Customer not found.";
    }

    if (error.response.status >= 500) {
      return "Server error. Please try again later.";
    }

    return "Something went wrong. Please try again.";
  };


  /* =========================
     Validation
  ========================= */

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  };

  const isValidPhone = (phone) => {
    return /^[0-9]{10}$/.test(
      phone
    );
  };


  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          Loading customer details...
        </div>
      </div>
    );
  }


  return (
    <div style={styles.page}>

      {/* =========================
          Header
      ========================= */}

      <div style={styles.header}>

        <div style={styles.titleSection}>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={styles.backButton}
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h2 style={styles.title}>
              {isEdit
                ? "Edit Customer"
                : "Add Customer"}
            </h2>

            <p style={styles.subtitle}>
              {isEdit
                ? "Update customer master data"
                : "Create a new customer"}
            </p>
          </div>

        </div>

      </div>


      {/* =========================
          Error Alert
      ========================= */}

      {error && (
        <div style={styles.errorBox}>

          <AlertCircle
            size={18}
            style={{
              flexShrink: 0,
            }}
          />

          <div>
            <strong style={styles.errorTitle}>
              Unable to save customer
            </strong>

            <div style={styles.errorMessage}>
              {error}
            </div>
          </div>

        </div>
      )}


      {/* =========================
          Form Card
      ========================= */}

      <div style={styles.card}>

        <form onSubmit={handleSubmit}>

          {/* Section Header */}

          <div style={styles.sectionHeader}>

            <h3 style={styles.sectionTitle}>
              Customer Information
            </h3>

            <p style={styles.sectionDescription}>
              Enter the customer details below.
              Fields marked with{" "}
              <span style={styles.required}>
                *
              </span>{" "}
              are required.
            </p>

          </div>


          {/* =========================
              Form Fields
          ========================= */}

          <div style={styles.formContainer}>

            {/* Customer Name - Full Row */}

            <div style={styles.formGroup}>

              <label style={styles.label}>
                Customer Name
                <span style={styles.required}>
                  *
                </span>
              </label>

              <input
                type="text"
                name="identity"
                value={formData.identity}
                onChange={handleChange}
                placeholder="Enter customer name"
                style={{
                  ...styles.input,
                  ...(fieldErrors.identity
                    ? styles.inputError
                    : {}),
                }}
              />

              {fieldErrors.identity && (
                <span style={styles.fieldError}>
                  {fieldErrors.identity}
                </span>
              )}

            </div>


            {/* Phone + Email */}

            <div style={styles.twoColumn}>

              {/* Phone */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Phone
                  <span style={styles.required}>
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit phone number"
                  maxLength={10}
                  style={{
                    ...styles.input,
                    ...(fieldErrors.phone
                      ? styles.inputError
                      : {}),
                  }}
                />

                {fieldErrors.phone && (
                  <span style={styles.fieldError}>
                    {fieldErrors.phone}
                  </span>
                )}

              </div>


              {/* Email */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  style={{
                    ...styles.input,
                    ...(fieldErrors.email
                      ? styles.inputError
                      : {}),
                  }}
                />

                {fieldErrors.email && (
                  <span style={styles.fieldError}>
                    {fieldErrors.email}
                  </span>
                )}

              </div>

            </div>


            {/* address + City + Pincode */}

            <div style={styles.threeColumn}>

              {/* address */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address address"
                  style={{
                    ...styles.input,
                    ...(fieldErrors.address
                      ? styles.inputError
                      : {}),
                  }}
                />

                {fieldErrors.address && (
                  <span style={styles.fieldError}>
                    {fieldErrors.address}
                  </span>
                )}

              </div>


              {/* City */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  style={{
                    ...styles.input,
                    ...(fieldErrors.city
                      ? styles.inputError
                      : {}),
                  }}
                />

                {fieldErrors.city && (
                  <span style={styles.fieldError}>
                    {fieldErrors.city}
                  </span>
                )}

              </div>


              {/* Pincode */}

              <div style={styles.formGroup}>

                <label style={styles.label}>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  maxLength={6}
                  style={{
                    ...styles.input,
                    ...(fieldErrors.pincode
                      ? styles.inputError
                      : {}),
                  }}
                />

                {fieldErrors.pincode && (
                  <span style={styles.fieldError}>
                    {fieldErrors.pincode}
                  </span>
                )}

              </div>

            </div>

          </div>


          {/* =========================
              Status
          ========================= */}

          <div style={styles.statusSection}>

            <div>

              <h4 style={styles.statusTitle}>
                Customer Status
              </h4>

              <p style={styles.statusDescription}>
                Set whether this customer is
                currently active.
              </p>

            </div>

            <label
              style={styles.switchContainer}
            >

              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={handleStatusChange}
                style={styles.checkbox}
              />

              <span
                style={{
                  ...styles.switch,
                  backgroundColor:
                    formData.is_active
                      ? "#4f46e5"
                      : "#cbd5e1",
                }}
              >

                <span
                  style={{
                    ...styles.switchKnob,
                    transform:
                      formData.is_active
                        ? "translateX(20px)"
                        : "translateX(2px)",
                  }}
                />

              </span>

              <span style={styles.activeText}>
                {formData.is_active
                  ? "Active"
                  : "Inactive"}
              </span>

            </label>

          </div>


          {/* =========================
              Footer
          ========================= */}

          <div style={styles.footer}>

            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.saveButton,
                opacity: saving ? 0.7 : 1,
              }}
            >

              <Save size={17} />

              {saving
                ? "Saving..."
                : isEdit
                ? "Update Customer"
                : "Save Customer"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


/* =====================================================
   Styles
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "24px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },


  /* Header */

  header: {
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


  /* Error */

  errorBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "20px",
    padding: "13px 15px",
    borderRadius: "9px",
    border: "1px solid #fecaca",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
  },

  errorTitle: {
    display: "block",
    fontSize: "13px",
    marginBottom: "3px",
  },

  errorMessage: {
    fontSize: "13px",
  },


  /* Card */

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow:
      "0 1px 3px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
  },


  /* Section */

  sectionHeader: {
    padding: "20px 22px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
  },

  sectionDescription: {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#64748b",
  },


  /* Form Container */

  formContainer: {
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },


  /* Form Group */

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },

  required: {
    color: "#dc2626",
    marginLeft: "3px",
  },


  /* Input */

  input: {
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    padding: "0 12px",
    border: "1px solid #dbe1ea",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "#ffffff",
    transition: "border-color 0.2s",
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fffafa",
  },

  fieldError: {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "-2px",
  },


  /* Phone + Email */

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },


  /* address + City + Pincode */

  threeColumn: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr",
    gap: "20px",
  },


  /* Status */

  statusSection: {
    margin: "0 22px 22px",
    padding: "16px",
    border: "1px solid #e2e8f0",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    backgroundColor: "#f8fafc",
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
    color: "#64748b",
  },

  switchContainer: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    cursor: "pointer",
  },

  checkbox: {
    display: "none",
  },

  switch: {
    width: "42px",
    height: "22px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    transition: "0.2s",
  },

  switchKnob: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    transition: "0.2s",
    boxShadow:
      "0 1px 3px rgba(0, 0, 0, 0.2)",
  },

  activeText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    minWidth: "55px",
  },


  /* Footer */

  footer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
    padding: "16px 22px",
    borderTop:
      "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },

  cancelButton: {
    height: "40px",
    padding: "0 16px",
    border: "1px solid #dbe1ea",
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
    padding: "0 17px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },


  /* Loading */

  loadingCard: {
    padding: "40px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },
};

export default CustomerForm;
