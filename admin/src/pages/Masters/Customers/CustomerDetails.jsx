
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ArrowLeft,
    Pencil,
    Mail,
    Phone,
    MapPin,
    User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const CustomerDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://127.0.0.1:8000/master/customers/${id}/`,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );

            setCustomer(response.data);
        } catch (error) {
            console.error("Error fetching customer:", error);

            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.status === 404) {
                setError("Customer not found.");
            } else if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else {
                setError("Unable to load customer details.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loadingCard}>
                    Loading customer details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.errorCard}>
                    <h3 style={styles.errorTitle}>
                        Unable to load customer
                    </h3>

                    <p style={styles.errorText}>
                        {error}
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!customer) {
        return null;
    }

    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <button
                        onClick={() => navigate(-1)}
                        style={styles.backIconButton}
                        title="Go Back"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h2 style={styles.title}>
                            Customer Details
                        </h2>

                        <p style={styles.subtitle}>
                            View customer master information
                        </p>
                    </div>
                </div>

                <button
                    onClick={() =>
                        navigate(`/customers/add/${customer.id}`)
                    }
                    style={styles.editButton}
                >
                    <Pencil size={16} />
                    Edit Customer
                </button>
            </div>

            {/* Customer Header */}
            <div style={styles.profileCard}>
                <div style={styles.avatar}>
                    <User size={25} />
                </div>

                <div style={styles.profileInfo}>
                    <h3 style={styles.customerName}>
                        {customer.identity}
                    </h3>

                    <span
                        style={{
                            ...styles.status,
                            ...(customer.is_active
                                ? styles.active
                                : styles.inactive),
                        }}
                    >
                        <span
                            style={{
                                ...styles.statusDot,
                                ...(customer.is_active
                                    ? styles.activeDot
                                    : styles.inactiveDot),
                            }}
                        />

                        {customer.is_active
                            ? "Active"
                            : "Inactive"}
                    </span>
                </div>
            </div>

            {/* Contact Information */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                        Contact Information
                    </h3>
                </div>

                <div style={styles.infoGrid}>

                    {/* Phone */}
                    <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                            <Phone size={18} />
                        </div>

                        <div>
                            <p style={styles.label}>
                                Phone
                            </p>

                            <p style={styles.value}>
                                {customer.phone || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                            <Mail size={18} />
                        </div>

                        <div>
                            <p style={styles.label}>
                                Email
                            </p>

                            <p style={styles.value}>
                                {customer.email || "-"}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Address Information */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                        Address Information
                    </h3>
                </div>

                <div style={styles.infoGrid}>

                    {/* Street */}
                    <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                            <MapPin size={18} />
                        </div>

                        <div>
                            <p style={styles.label}>
                                Street
                            </p>

                            <p style={styles.value}>
                                {customer.street || "-"}
                            </p>
                        </div>
                    </div>

                    {/* City */}
                    <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                            <MapPin size={18} />
                        </div>

                        <div>
                            <p style={styles.label}>
                                City
                            </p>

                            <p style={styles.value}>
                                {customer.city || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Pincode */}
                    <div style={styles.infoItem}>
                        <div style={styles.infoIcon}>
                            <MapPin size={18} />
                        </div>

                        <div>
                            <p style={styles.label}>
                                Pincode
                            </p>

                            <p style={styles.value}>
                                {customer.pincode || "-"}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

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

    backIconButton: {
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

    editButton: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "10px 15px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#4f46e5",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },

    profileCard: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
    },

    avatar: {
        width: "52px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        backgroundColor: "#eef2ff",
        color: "#4f46e5",
    },

    profileInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
    },

    customerName: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "600",
        color: "#0f172a",
    },

    status: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        width: "fit-content",
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500",
    },

    active: {
        backgroundColor: "#ecfdf3",
        color: "#15803d",
    },

    inactive: {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
    },

    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
    },

    activeDot: {
        backgroundColor: "#22c55e",
    },

    inactiveDot: {
        backgroundColor: "#ef4444",
    },

    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
        overflow: "hidden",
    },

    cardHeader: {
        padding: "16px 20px",
        borderBottom: "1px solid #e2e8f0",
    },

    cardTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: "600",
        color: "#0f172a",
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        padding: "20px",
    },

    infoItem: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
    },

    infoIcon: {
        width: "36px",
        height: "36px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        backgroundColor: "#f1f5f9",
        color: "#64748b",
    },

    label: {
        margin: "0 0 5px",
        fontSize: "12px",
        fontWeight: "500",
        color: "#94a3b8",
    },

    value: {
        margin: 0,
        fontSize: "14px",
        fontWeight: "500",
        color: "#334155",
    },

    loadingCard: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "40px",
        textAlign: "center",
        color: "#64748b",
    },

    errorCard: {
        backgroundColor: "#ffffff",
        border: "1px solid #fecaca",
        borderRadius: "12px",
        padding: "30px",
    },

    errorTitle: {
        margin: "0 0 8px",
        fontSize: "16px",
        color: "#991b1b",
    },

    errorText: {
        margin: "0 0 20px",
        fontSize: "14px",
        color: "#dc2626",
    },

    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        padding: "9px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#475569",
        cursor: "pointer",
        fontSize: "14px",
    },
};

export default CustomerDetails;