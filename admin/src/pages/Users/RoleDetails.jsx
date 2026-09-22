import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Edit, ShieldCheck, X } from "lucide-react";

import api from "../../apis/base";

const RoleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const permissionGroups = [
        {
            title: "Master Data",
            fields: [
                ["style", "Style"],
                ["season", "Season"],
                ["size", "Size"],
                ["color", "Color"],
                ["fabric", "Fabric"],
                ["accessory", "Accessory"],
                ["category", "Category"],
                ["customer", "Customer"],
                ["supplier", "Supplier"],
                ["bom", "BOM"],
            ],
        },
        {
            title: "Inventory",
            fields: [
                ["inventory", "Inventory"],
                ["stock", "Stock"],
                ["supply_order", "Supply Order"],
            ],
        },
        {
            title: "Production",
            fields: [
                ["production", "Production"],
                ["delivery", "Delivery"],
            ],
        },
        {
            title: "System",
            fields: [
                ["reports", "Reports"],
                ["users", "Users"],
                ["roles", "Roles"],
            ],
        },
    ];

    useEffect(() => {
        fetchRole();
    }, [id]);

    const fetchRole = async () => {
        try {
            setLoading(true);
            const response = await api.get(`auth/roles/${id}/`);
            setRole(response.data);
        } catch (error) {
            console.error("Failed to fetch role", error);
        } finally {
            setLoading(false);
        }
    };

    const getPermissionCount = () => {
        if (!role) return 0;

        return permissionGroups.reduce((total, group) => {
            return (
                total +
                group.fields.filter(([key]) => role[key] === true).length
            );
        }, 0);
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>Loading role details...</div>
            </div>
        );
    }

    if (!role) {
        return (
            <div style={styles.page}>
                <div style={styles.empty}>
                    <ShieldCheck size={40} strokeWidth={1.5} />
                    <h3>Role not found</h3>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/roles")}
                    >
                        <ArrowLeft size={16} />
                        Back to Roles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Role Details</h1>
                    <p style={styles.subtitle}>
                        View role information and permissions
                    </p>
                </div>

                <div style={styles.headerActions}>
                    <button
                        style={styles.secondaryButton}
                        onClick={() => navigate("/roles")}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <button
                        style={styles.primaryButton}
                        onClick={() => navigate(`/roles/add/${role.id}`)}
                    >
                        <Edit size={16} />
                        Edit Role
                    </button>
                </div>
            </div>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div style={styles.roleIcon}>
                        <ShieldCheck size={24} />
                    </div>

                    <div>
                        <h2 style={styles.roleName}>{role.identity}</h2>
                        <div style={styles.roleMeta}>
                            <span
                                style={{
                                    ...styles.statusBadge,
                                    ...(role.is_active
                                        ? styles.activeBadge
                                        : styles.inactiveBadge),
                                }}
                            >
                                <span
                                    style={{
                                        ...styles.statusDot,
                                        backgroundColor: role.is_active
                                            ? "#16a34a"
                                            : "#dc2626",
                                    }}
                                />
                                {role.is_active ? "Active" : "Inactive"}
                            </span>

                            <span style={styles.permissionSummary}>
                                {getPermissionCount()} permissions enabled
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.sectionTitle}>Permissions</div>

            <div style={styles.permissionGrid}>
                {permissionGroups.map((group) => {
                    const enabledCount = group.fields.filter(
                        ([key]) => role[key] === true
                    ).length;

                    return (
                        <div key={group.title} style={styles.permissionCard}>
                            <div style={styles.permissionHeader}>
                                <div>
                                    <h3 style={styles.permissionTitle}>
                                        {group.title}
                                    </h3>
                                    <p style={styles.permissionSubtitle}>
                                        {enabledCount} of {group.fields.length}{" "}
                                        enabled
                                    </p>
                                </div>
                            </div>

                            <div style={styles.permissionList}>
                                {group.fields.map(([key, label]) => {
                                    const enabled = role[key] === true;

                                    return (
                                        <div
                                            key={key}
                                            style={styles.permissionRow}
                                        >
                                            <div style={styles.permissionName}>
                                                {label}
                                            </div>

                                            <div
                                                style={{
                                                    ...styles.permissionStatus,
                                                    ...(enabled
                                                        ? styles.granted
                                                        : styles.denied),
                                                }}
                                            >
                                                {enabled ? (
                                                    <>
                                                        <Check size={14} />
                                                        Allowed
                                                    </>
                                                ) : (
                                                    <>
                                                        <X size={14} />
                                                        Not Allowed
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.card}>
                <div style={styles.auditHeader}>
                    <div>
                        <h3 style={styles.auditTitle}>Role Information</h3>
                        <p style={styles.auditSubtitle}>
                            Basic role configuration
                        </p>
                    </div>
                </div>

                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Role Name</span>
                        <span style={styles.infoValue}>
                            {role.identity || "-"}
                        </span>
                    </div>

                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Status</span>
                        <span style={styles.infoValue}>
                            {role.is_active ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Permissions</span>
                        <span style={styles.infoValue}>
                            {getPermissionCount()}
                        </span>
                    </div>

                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Role ID</span>
                        <span style={styles.infoValue}>#{role.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        padding: "24px",
        background: "#f8fafc",
        minHeight: "100vh",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    },

    title: {
        margin: 0,
        fontSize: "24px",
        fontWeight: 700,
        color: "#0f172a",
    },

    subtitle: {
        margin: "6px 0 0",
        fontSize: "14px",
        color: "#64748b",
    },

    headerActions: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },

    primaryButton: {
        height: "38px",
        padding: "0 15px",
        border: "none",
        borderRadius: "7px",
        background: "#4f46e5",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "7px",
        cursor: "pointer",
    },

    secondaryButton: {
        height: "38px",
        padding: "0 15px",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        background: "#fff",
        color: "#334155",
        fontSize: "14px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "7px",
        cursor: "pointer",
    },

    card: {
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        marginBottom: "20px",
    },

    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "20px",
    },

    roleIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    roleName: {
        margin: 0,
        fontSize: "18px",
        fontWeight: 700,
        color: "#0f172a",
    },

    roleMeta: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginTop: "7px",
    },

    statusBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 9px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
    },

    activeBadge: {
        background: "#f0fdf4",
        color: "#15803d",
    },

    inactiveBadge: {
        background: "#fef2f2",
        color: "#b91c1c",
    },

    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
    },

    permissionSummary: {
        fontSize: "13px",
        color: "#64748b",
    },

    sectionTitle: {
        fontSize: "16px",
        fontWeight: 700,
        color: "#0f172a",
        marginBottom: "12px",
    },

    permissionGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "18px",
        marginBottom: "20px",
    },

    permissionCard: {
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
    },

    permissionHeader: {
        padding: "16px 18px",
        borderBottom: "1px solid #e2e8f0",
        background: "#fafafa",
    },

    permissionTitle: {
        margin: 0,
        fontSize: "14px",
        fontWeight: 700,
        color: "#0f172a",
    },

    permissionSubtitle: {
        margin: "4px 0 0",
        fontSize: "12px",
        color: "#64748b",
    },

    permissionList: {
        padding: "4px 18px",
    },

    permissionRow: {
        minHeight: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f1f5f9",
    },

    permissionName: {
        fontSize: "14px",
        color: "#334155",
        fontWeight: 500,
    },

    permissionStatus: {
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 600,
    },

    granted: {
        background: "#f0fdf4",
        color: "#15803d",
    },

    denied: {
        background: "#f8fafc",
        color: "#94a3b8",
    },

    auditHeader: {
        padding: "18px 20px",
        borderBottom: "1px solid #e2e8f0",
    },

    auditTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: 700,
        color: "#0f172a",
    },

    auditSubtitle: {
        margin: "4px 0 0",
        fontSize: "13px",
        color: "#64748b",
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        padding: "18px 20px",
        gap: "20px",
    },

    infoItem: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    infoLabel: {
        fontSize: "12px",
        color: "#64748b",
        fontWeight: 500,
    },

    infoValue: {
        fontSize: "14px",
        color: "#0f172a",
        fontWeight: 600,
    },

    loading: {
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        fontSize: "14px",
    },

    empty: {
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        gap: "10px",
    },

    backButton: {
        marginTop: "10px",
        height: "38px",
        padding: "0 15px",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        background: "#fff",
        color: "#334155",
        fontSize: "14px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "7px",
        cursor: "pointer",
    },
};

export default RoleDetails;