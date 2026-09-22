import React, { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Eye,
    Pencil,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/base";
import Pagination from "../../components/Pagination";

const UserList = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, search, status]);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const params = {
                page: currentPage,
            };

            if (search) {
                params.search = search;
            }

            if (status) {
                params.is_active = status;
            }

            const response = await api.get(
                "auth/users/",
                { params }
            );

            const data = response.data;

            if (Array.isArray(data)) {
                setUsers(data);
                setTotalPages(1);
            } else {
                setUsers(data.results || []);
                setTotalPages(
                    data.total_pages ||
                    Math.ceil((data.count || 0) / 10) ||
                    1
                );
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setCurrentPage(1);
    };

    const getStatusStyle = (isActive) => {
        if (isActive) {
            return {
                background: "#ecfdf5",
                color: "#047857",
                dot: "#10b981",
            };
        }

        return {
            background: "#fef2f2",
            color: "#dc2626",
            dot: "#ef4444",
        };
    };

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        Users
                    </h1>

                    <p style={styles.subtitle}>
                        Manage system users and access
                    </p>
                </div>

                <button
                    style={styles.addButton}
                    onClick={() => navigate("/users/add")}
                >
                    <Plus size={17} />
                    Add User
                </button>
            </div>

            <div style={styles.filterCard}>
                <div style={styles.searchWrapper}>
                    <Search
                        size={17}
                        color="#94a3b8"
                        style={styles.searchIcon}
                    />

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={handleSearch}
                        style={styles.searchInput}
                    />
                </div>

                <select
                    value={status}
                    onChange={handleStatusChange}
                    style={styles.statusSelect}
                >
                    <option value="">
                        All Status
                    </option>

                    <option value="true">
                        Active
                    </option>

                    <option value="false">
                        Inactive
                    </option>
                </select>

                {(search || status) && (
                    <button
                        style={styles.clearButton}
                        onClick={clearFilters}
                    >
                        <X size={15} />
                        Clear
                    </button>
                )}
            </div>

            <div style={styles.tableCard}>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>
                                    User
                                </th>

                                <th style={styles.th}>
                                    Email
                                </th>

                                <th style={styles.th}>
                                    Phone
                                </th>

                                <th style={styles.th}>
                                    Role
                                </th>

                                <th style={styles.th}>
                                    Status
                                </th>

                                <th
                                    style={{
                                        ...styles.th,
                                        textAlign: "right",
                                    }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={styles.emptyCell}
                                    >
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={styles.emptyCell}
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    const statusStyle =
                                        getStatusStyle(
                                            user.is_active
                                        );

                                    return (
                                        <tr
                                            key={user.id}
                                            style={styles.tr}
                                        >
                                            <td style={styles.td}>
                                                <div
                                                    style={
                                                        styles.userCell
                                                    }
                                                >
                                                    <div
                                                        style={
                                                            styles.avatar
                                                        }
                                                    >
                                                        {(
                                                            user.identity ||
                                                            user.email ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <div
                                                            style={
                                                                styles.userName
                                                            }
                                                        >
                                                            {user.identity ||
                                                                "-"}
                                                        </div>

                                                        {user.is_superuser && (
                                                            <span
                                                                style={
                                                                    styles.superAdmin
                                                                }
                                                            >
                                                                Super Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={styles.td}>
                                                {user.email || "-"}
                                            </td>

                                            <td style={styles.td}>
                                                {user.phone || "-"}
                                            </td>

                                            <td style={styles.td}>
                                                {user.role_name ||
                                                    user.role_details?.identity ||
                                                    "-"}
                                            </td>

                                            <td style={styles.td}>
                                                <span
                                                    style={{
                                                        ...styles.statusBadge,
                                                        background:
                                                            statusStyle.background,
                                                        color:
                                                            statusStyle.color,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            ...styles.statusDot,
                                                            background:
                                                                statusStyle.dot,
                                                        }}
                                                    />

                                                    {user.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    textAlign: "right",
                                                }}
                                            >
                                                <div
                                                    style={
                                                        styles.actions
                                                    }
                                                >
                                                    <button
                                                        style={
                                                            styles.actionButton
                                                        }
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(
                                                                `/users/details/${user.id}`
                                                            )
                                                        }
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        style={
                                                            styles.actionButton
                                                        }
                                                        title="Edit"
                                                        onClick={() =>
                                                            navigate(
                                                                `/users/add/${user.id}`
                                                            )
                                                        }
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={styles.footer}>
                    <div style={styles.resultText}>
                        Showing{" "}
                        <strong>
                            {users.length}
                        </strong>{" "}
                        users
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
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

    addButton: {
        height: "38px",
        padding: "0 15px",
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

    filterCard: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        marginBottom: "16px",
    },

    searchWrapper: {
        position: "relative",
        width: "320px",
    },

    searchIcon: {
        position: "absolute",
        left: "11px",
        top: "50%",
        transform: "translateY(-50%)",
    },

    searchInput: {
        width: "100%",
        height: "36px",
        padding: "0 12px 0 34px",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        outline: "none",
        fontSize: "13px",
        color: "#0f172a",
        boxSizing: "border-box",
    },

    statusSelect: {
        width: "160px",
        height: "36px",
        padding: "0 10px",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        background: "#ffffff",
        color: "#475569",
        fontSize: "13px",
        outline: "none",
        cursor: "pointer",
    },

    clearButton: {
        height: "36px",
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        background: "#ffffff",
        color: "#64748b",
        fontSize: "13px",
        cursor: "pointer",
    },

    tableCard: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "9px",
        overflow: "hidden",
    },

    tableWrapper: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    th: {
        padding: "12px 16px",
        textAlign: "left",
        fontSize: "12px",
        fontWeight: 600,
        color: "#64748b",
        background: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        whiteSpace: "nowrap",
    },

    tr: {
        borderBottom: "1px solid #f1f5f9",
    },

    td: {
        padding: "13px 16px",
        fontSize: "14px",
        color: "#334155",
        whiteSpace: "nowrap",
    },

    userCell: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    avatar: {
        width: "34px",
        height: "34px",
        borderRadius: "7px",
        background: "#eef2ff",
        color: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: 600,
        flexShrink: 0,
    },

    userName: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#0f172a",
    },

    superAdmin: {
        display: "inline-block",
        marginTop: "2px",
        fontSize: "11px",
        color: "#4f46e5",
        fontWeight: 500,
    },

    statusBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 9px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 500,
    },

    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
    },

    actions: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "6px",
    },

    actionButton: {
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        background: "#ffffff",
        color: "#475569",
        cursor: "pointer",
    },

    emptyCell: {
        padding: "50px 20px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "14px",
    },

    footer: {
        minHeight: "58px",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: "1px solid #e2e8f0",
    },

    resultText: {
        fontSize: "13px",
        color: "#64748b",
    },
};

export default UserList;