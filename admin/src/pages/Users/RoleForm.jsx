import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../apis/base";


const RoleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        identity: "",

        style: false,
        season: false,
        size: false,
        color: false,
        fabric: false,
        accessory: false,
        category: false,
        customer: false,
        supplier: false,
        bom: false,

        inventory: false,
        stock: false,
        supply_order: false,

        production: false,
        delivery: false,

        reports: false,

        users: false,
        roles: false,

        is_active: true,
    });

    useEffect(() => {
        if (isEdit) {
            fetchRole();
        }
    }, [id]);

    const fetchRole = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `auth/roles/${id}/`
            );

            const role = response.data;

            setFormData({
                identity: role.identity || "",

                style: role.style ?? false,
                season: role.season ?? false,
                size: role.size ?? false,
                color: role.color ?? false,
                fabric: role.fabric ?? false,
                accessory: role.accessory ?? false,
                category: role.category ?? false,
                customer: role.customer ?? false,
                supplier: role.supplier ?? false,
                bom: role.bom ?? false,

                inventory: role.inventory ?? false,
                stock: role.stock ?? false,
                supply_order: role.supply_order ?? false,

                production: role.production ?? false,
                delivery: role.delivery ?? false,

                reports: role.reports ?? false,

                users: role.users ?? false,
                roles: role.roles ?? false,

                is_active: role.is_active ?? true,
            });
        } catch (error) {
            console.error(
                "Failed to fetch role:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            if (isEdit) {
                await api.put(
                    `auth/roles/${id}/`,
                    formData
                );
            } else {
                await api.post(
                    "auth/roles/",
                    formData
                );
            }

            navigate("/roles");
        } catch (error) {
            console.error(
                "Failed to save role:",
                error
            );
        } finally {
            setSaving(false);
        }
    };

    const masterPermissions = [
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
    ];

    const inventoryPermissions = [
        ["inventory", "Inventory"],
        ["stock", "Stock"],
        ["supply_order", "Supply Orders"],
    ];

    const productionPermissions = [
        ["production", "Production"],
        ["delivery", "Delivery"],
    ];

    const systemPermissions = [
        ["reports", "Reports"],
        ["users", "Users"],
        ["roles", "Roles"],
    ];

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>
                    Loading role...
                </div>
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
                        onClick={() =>
                            navigate("/roles")
                        }
                    >
                        <ArrowLeft size={17} />
                    </button>

                    <div>
                        <h1 style={styles.title}>
                            {isEdit
                                ? "Edit Role"
                                : "Add Role"}
                        </h1>

                        <p style={styles.subtitle}>
                            {isEdit
                                ? "Update role and permissions"
                                : "Create a new role and assign permissions"}
                        </p>
                    </div>

                </div>

            </div>

            <form onSubmit={handleSubmit}>

                <div style={styles.card}>

                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>
                            Role Information
                        </h2>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.formGrid}>

                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Role Name
                                <span style={styles.required}>
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="identity"
                                value={formData.identity}
                                onChange={handleChange}
                                placeholder="Enter role name"
                                style={styles.input}
                                required
                            />

                        </div>

                    </div>

                </div>

                <PermissionSection
                    title="Master Data"
                    permissions={masterPermissions}
                    formData={formData}
                    onChange={handleChange}
                />

                <PermissionSection
                    title="Inventory"
                    permissions={inventoryPermissions}
                    formData={formData}
                    onChange={handleChange}
                />

                <PermissionSection
                    title="Production"
                    permissions={productionPermissions}
                    formData={formData}
                    onChange={handleChange}
                />

                <PermissionSection
                    title="System"
                    permissions={systemPermissions}
                    formData={formData}
                    onChange={handleChange}
                />

                <div style={styles.card}>

                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>
                            Role Status
                        </h2>
                    </div>

                    <div style={styles.divider} />

                    <label style={styles.checkboxRow}>

                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            style={styles.checkbox}
                        />

                        <div>
                            <div style={styles.checkboxTitle}>
                                Active
                            </div>

                            <div style={styles.checkboxText}>
                                Allow this role to be assigned to users
                            </div>
                        </div>

                    </label>

                </div>

                <div style={styles.footer}>

                    <button
                        type="button"
                        style={styles.cancelButton}
                        onClick={() =>
                            navigate("/roles")
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        style={styles.saveButton}
                        disabled={saving}
                    >
                        <Save size={16} />

                        {saving
                            ? "Saving..."
                            : isEdit
                                ? "Update Role"
                                : "Create Role"}
                    </button>

                </div>

            </form>

        </div>
    );
};


const PermissionSection = ({
    title,
    permissions,
    formData,
    onChange,
}) => {
    return (
        <div style={styles.card}>

            <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                    {title}
                </h2>
            </div>

            <div style={styles.divider} />

            <div style={styles.permissionGrid}>

                {permissions.map(([key, label]) => (
                    <label
                        key={key}
                        style={styles.permissionItem}
                    >
                        <input
                            type="checkbox"
                            name={key}
                            checked={formData[key]}
                            onChange={onChange}
                            style={styles.checkbox}
                        />

                        <span style={styles.permissionLabel}>
                            {label}
                        </span>
                    </label>
                ))}

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
        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
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

    permissionGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "10px",
        padding: "18px 20px",
    },

    permissionItem: {
        minHeight: "42px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "0 11px",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        background: "#ffffff",
        cursor: "pointer",
    },

    permissionLabel: {
        fontSize: "13px",
        color: "#334155",
        fontWeight: 500,
    },

    checkboxRow: {
        display: "flex",
        alignItems: "center",
        gap: "11px",
        padding: "16px 20px",
        cursor: "pointer",
    },

    checkbox: {
        width: "16px",
        height: "16px",
        accentColor: "#4f46e5",
        cursor: "pointer",
        flexShrink: 0,
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
        cursor: "pointer",
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

export default RoleForm;