import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    ShieldCheck,
    Calendar,
    CheckCircle,
    XCircle,
} from "lucide-react";
import api from "../../apis/base";



const UserDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `auth/users/${id}/`
            );

            setUser(response.data);
        } catch (error) {
            console.error(
                "Failed to fetch user:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPermissionList = () => {
        if (!user?.role_details) {
            return [];
        }

        const permissions = user.role_details;

        return [
            ["style", "Styles"],
            ["season", "Seasons"],
            ["size", "Sizes"],
            ["color", "Colors"],
            ["fabric", "Fabrics"],
            ["accessory", "Accessory"],
            ["category", "Categories"],
            ["customer", "Customers"],
            ["supplier", "Suppliers"],
            ["bom", "BOM"],
            ["inventory", "Inventory"],
            ["stock", "Stock"],
            ["supply_order", "Supply Orders"],
            ["production", "Production"],
            ["delivery", "Delivery"],
            ["reports", "Reports"],
            ["users", "Users"],
            ["roles", "Roles"],
        ].map(([key, label]) => ({
            key,
            label,
            enabled: permissions[key] === true,
        }));
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>
                    Loading user details...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={styles.page}>
                <div style={styles.empty}>
                    <p>User not found.</p>

                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/users")}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>
            </div>
        );
    }

    const permissions = getPermissionList();

    return (
        <div style={styles.page}>

            <div style={styles.header}>

                <div style={styles.headerLeft}>

                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/users")}
                    >
                        <ArrowLeft size={17} />
                    </button>

                    <div>
                        <h1 style={styles.title}>
                            User Details
                        </h1>

                        <p style={styles.subtitle}>
                            View user information and access
                        </p>
                    </div>

                </div>

                <button
                    style={styles.editButton}
                    onClick={() =>
                        navigate(`/users/add/${user.id}`)
                    }
                >
                    Edit User
                </button>

            </div>

            <div style={styles.content}>

                <div style={styles.card}>

                    <div style={styles.profileHeader}>

                        <div style={styles.avatar}>
                            {(
                                user.identity ||
                                user.email ||
                                "U"
                            )
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div style={styles.profileInfo}>

                            <h2 style={styles.profileName}>
                                {user.identity || "-"}
                            </h2>

                            <p style={styles.profileEmail}>
                                {user.email}
                            </p>

                        </div>

                        <div
                            style={{
                                ...styles.statusBadge,
                                background: user.is_active
                                    ? "#ecfdf5"
                                    : "#fef2f2",
                                color: user.is_active
                                    ? "#047857"
                                    : "#dc2626",
                            }}
                        >
                            <span
                                style={{
                                    ...styles.statusDot,
                                    background: user.is_active
                                        ? "#10b981"
                                        : "#ef4444",
                                }}
                            />

                            {user.is_active
                                ? "Active"
                                : "Inactive"}
                        </div>

                    </div>

                </div>

                <div style={styles.card}>

                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitleWrapper}>
                            <User
                                size={18}
                                color="#4f46e5"
                            />

                            <h2 style={styles.cardTitle}>
                                User Information
                            </h2>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.grid}>

                        <InfoItem
                            icon={<User size={17} />}
                            label="Name"
                            value={user.identity}
                        />

                        <InfoItem
                            icon={<Mail size={17} />}
                            label="Email"
                            value={user.email}
                        />

                        <InfoItem
                            icon={<Phone size={17} />}
                            label="Phone"
                            value={user.phone}
                        />

                        <InfoItem
                            icon={<ShieldCheck size={17} />}
                            label="Role"
                            value={
                                user.role_details?.identity ||
                                "-"
                            }
                        />

                        <InfoItem
                            icon={<ShieldCheck size={17} />}
                            label="Staff"
                            value={
                                user.is_staff
                                    ? "Yes"
                                    : "No"
                            }
                        />

                        <InfoItem
                            icon={<ShieldCheck size={17} />}
                            label="Superuser"
                            value={
                                user.is_superuser
                                    ? "Yes"
                                    : "No"
                            }
                        />

                    </div>

                </div>

                {user.is_superuser ? (
                    <div style={styles.card}>

                        <div style={styles.cardHeader}>
                            <div style={styles.cardTitleWrapper}>
                                <ShieldCheck
                                    size={18}
                                    color="#4f46e5"
                                />

                                <h2 style={styles.cardTitle}>
                                    Access Permissions
                                </h2>
                            </div>
                        </div>

                        <div style={styles.divider} />

                        <div style={styles.superuserBox}>
                            <CheckCircle
                                size={20}
                                color="#16a34a"
                            />

                            <div>
                                <div style={styles.superuserTitle}>
                                    Full Access
                                </div>

                                <div style={styles.superuserText}>
                                    This user is a superuser and has
                                    access to all system menus.
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div style={styles.card}>

                        <div style={styles.cardHeader}>
                            <div style={styles.cardTitleWrapper}>
                                <ShieldCheck
                                    size={18}
                                    color="#4f46e5"
                                />

                                <h2 style={styles.cardTitle}>
                                    Access Permissions
                                </h2>
                            </div>
                        </div>

                        <div style={styles.divider} />

                        {user.role_details ? (
                            <div style={styles.permissionGrid}>

                                {permissions.map((permission) => (
                                    <div
                                        key={permission.key}
                                        style={
                                            styles.permissionItem
                                        }
                                    >
                                        <div
                                            style={
                                                permission.enabled
                                                    ? styles.permissionIconActive
                                                    : styles.permissionIconInactive
                                            }
                                        >
                                            {permission.enabled ? (
                                                <CheckCircle
                                                    size={16}
                                                />
                                            ) : (
                                                <XCircle
                                                    size={16}
                                                />
                                            )}
                                        </div>

                                        <span
                                            style={
                                                permission.enabled
                                                    ? styles.permissionEnabled
                                                    : styles.permissionDisabled
                                            }
                                        >
                                            {permission.label}
                                        </span>

                                    </div>
                                ))}

                            </div>
                        ) : (
                            <div style={styles.noRole}>
                                No role assigned to this user.
                            </div>
                        )}

                    </div>
                )}

                <div style={styles.card}>

                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitleWrapper}>
                            <Calendar
                                size={18}
                                color="#4f46e5"
                            />

                            <h2 style={styles.cardTitle}>
                                Account Status
                            </h2>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.grid}>

                        <InfoItem
                            icon={<CheckCircle size={17} />}
                            label="Account Status"
                            value={
                                user.is_active
                                    ? "Active"
                                    : "Inactive"
                            }
                        />

                        <InfoItem
                            icon={<ShieldCheck size={17} />}
                            label="Staff Account"
                            value={
                                user.is_staff
                                    ? "Yes"
                                    : "No"
                            }
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};


const InfoItem = ({ icon, label, value }) => {
    return (
        <div style={styles.infoItem}>

            <div style={styles.infoIcon}>
                {icon}
            </div>

            <div>
                <div style={styles.infoLabel}>
                    {label}
                </div>

                <div style={styles.infoValue}>
                    {value || "-"}
                </div>
            </div>

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

    subtitle: {
        margin: "5px 0 0",
        fontSize: "14px",
        color: "#64748b",
    },

    editButton: {
        height: "38px",
        padding: "0 15px",
        border: "none",
        borderRadius: "7px",
        background: "#4f46e5",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
    },

    content: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "1200px",
    },

    card: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        overflow: "hidden",
    },

    profileHeader: {
        display: "flex",
        alignItems: "center",
        padding: "20px",
        gap: "14px",
    },

    avatar: {
        width: "52px",
        height: "52px",
        borderRadius: "9px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        fontWeight: 600,
        flexShrink: 0,
    },

    profileInfo: {
        flex: 1,
    },

    profileName: {
        margin: 0,
        fontSize: "18px",
        fontWeight: 600,
        color: "#0f172a",
    },

    profileEmail: {
        margin: "4px 0 0",
        fontSize: "13px",
        color: "#64748b",
    },

    statusBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 500,
    },

    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
    },

    cardHeader: {
        minHeight: "56px",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
    },

    cardTitleWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
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

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },

    infoItem: {
        minHeight: "78px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: "1px solid #f1f5f9",
    },

    infoIcon: {
        width: "34px",
        height: "34px",
        borderRadius: "7px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },

    infoLabel: {
        fontSize: "12px",
        color: "#64748b",
        marginBottom: "4px",
    },

    infoValue: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#0f172a",
    },

    permissionGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        padding: "16px 20px",
        gap: "10px",
    },

    permissionItem: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        minHeight: "42px",
        padding: "0 10px",
        border: "1px solid #f1f5f9",
        borderRadius: "7px",
    },

    permissionIconActive: {
        width: "26px",
        height: "26px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ecfdf5",
        color: "#16a34a",
    },

    permissionIconInactive: {
        width: "26px",
        height: "26px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fef2f2",
        color: "#dc2626",
    },

    permissionEnabled: {
        fontSize: "13px",
        fontWeight: 500,
        color: "#334155",
    },

    permissionDisabled: {
        fontSize: "13px",
        fontWeight: 500,
        color: "#94a3b8",
    },

    superuserBox: {
        margin: "16px 20px",
        padding: "15px",
        display: "flex",
        alignItems: "center",
        gap: "11px",
        borderRadius: "8px",
        background: "#f0fdf4",
        border: "1px solid #dcfce7",
        color: "#166534",
    },

    superuserTitle: {
        fontSize: "14px",
        fontWeight: 600,
    },

    superuserText: {
        marginTop: "3px",
        fontSize: "12px",
        color: "#4d7c5a",
    },

    noRole: {
        padding: "30px 20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#94a3b8",
    },

    loading: {
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        color: "#64748b",
    },

    empty: {
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        fontSize: "14px",
        color: "#64748b",
    },
};

export default UserDetails;