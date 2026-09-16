
import React, { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { getColors } from "../../../apis/masterApi";

const ColorList = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const params = {};

                if (search) {
                    params.search = search;
                }

                if (status) {
                    params.is_active = status;
                }

                const response = await getColors(params);

                setData(response.data.results);
            } catch (error) {
                console.error(error);
            }
        };

        fetchColors();
    }, [search, status]);

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
            flexDirection: "column",
            gap: "4px",
        },

        title: {
            margin: 0,
            fontSize: "24px",
            fontWeight: "650",
            color: "#0f172a",
        },

        subtitle: {
            margin: 0,
            fontSize: "14px",
            color: "#64748b",
        },

        addButton: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
        },

        card: {
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            overflow: "hidden",
        },

        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "16px 18px",
            borderBottom: "1px solid #e2e8f0",
        },

        filters: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
        },

        searchWrapper: {
            position: "relative",
            width: "320px",
        },

        searchIcon: {
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            pointerEvents: "none",
        },

        searchInput: {
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px 10px 38px",
            border: "1px solid #dbe1ea",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            color: "#334155",
        },

        select: {
            padding: "10px 34px 10px 12px",
            border: "1px solid #dbe1ea",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            color: "#475569",
            backgroundColor: "#ffffff",
            cursor: "pointer",
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
            padding: "13px 18px",
            textAlign: "left",
            fontSize: "12px",
            fontWeight: "600",
            color: "#64748b",
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            whiteSpace: "nowrap",
        },

        td: {
            padding: "15px 18px",
            fontSize: "14px",
            color: "#334155",
            borderBottom: "1px solid #f1f5f9",
            whiteSpace: "nowrap",
        },

        code: {
            fontFamily: "monospace",
            fontSize: "13px",
            fontWeight: "600",
            color: "#475569",
        },

        identity: {
            fontWeight: "500",
            color: "#0f172a",
        },

        status: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 9px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "500",
        },

        statusDot: {
            width: "6px",
            height: "6px",
            borderRadius: "50%",
        },

        active: {
            backgroundColor: "#ecfdf3",
            color: "#15803d",
        },

        activeDot: {
            backgroundColor: "#22c55e",
        },

        inactive: {
            backgroundColor: "#fef2f2",
            color: "#dc2626",
        },

        inactiveDot: {
            backgroundColor: "#ef4444",
        },

        actions: {
            display: "flex",
            alignItems: "center",
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
            backgroundColor: "#ffffff",
            cursor: "pointer",
        },

        editButton: {
            color: "#4f46e5",
        },

        deleteButton: {
            color: "#dc2626",
        },

        footer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
        },

        resultText: {
            fontSize: "13px",
            color: "#64748b",
        },

        pagination: {
            display: "flex",
            alignItems: "center",
            gap: "5px",
        },

        pageButton: {
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e2e8f0",
            borderRadius: "7px",
            backgroundColor: "#ffffff",
            color: "#475569",
            cursor: "pointer",
        },

        activePage: {
            backgroundColor: "#4f46e5",
            borderColor: "#4f46e5",
            color: "#ffffff",
        },
    };

    return (
        <div style={styles.page}>

            <div style={styles.header}>
                <div style={styles.titleSection}>
                    <h2 style={styles.title}>Colors</h2>

                    <p style={styles.subtitle}>
                        Manage color master data
                    </p>
                </div>

                <button style={styles.addButton}>
                    <Plus size={17} />
                    Add Color
                </button>
            </div>

            <div style={styles.card}>

                <div style={styles.toolbar}>

                    <div style={styles.filters}>

                        <div style={styles.searchWrapper}>
                            <Search
                                size={17}
                                style={styles.searchIcon}
                            />

                            <input
                                type="text"
                                placeholder="Search colors..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                style={styles.searchInput}
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            style={styles.select}
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                    </div>

                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>

                        <thead>
                            <tr>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Code</th>
                                <th style={styles.th}>Color</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((color, index) => (
                                <tr key={color.id}>

                                    <td
                                        style={{
                                            ...styles.td,
                                            color: "#94a3b8",
                                        }}
                                    >
                                        {index + 1}
                                    </td>

                                    <td
                                        style={{
                                            ...styles.td,
                                            ...styles.code,
                                        }}
                                    >
                                        {color.code}
                                    </td>

                                    <td
                                        style={{
                                            ...styles.td,
                                            ...styles.identity,
                                        }}
                                    >
                                        {color.identity}
                                    </td>

                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.status,
                                                ...(color.is_active
                                                    ? styles.active
                                                    : styles.inactive),
                                            }}
                                        >
                                            <span
                                                style={{
                                                    ...styles.statusDot,
                                                    ...(color.is_active
                                                        ? styles.activeDot
                                                        : styles.inactiveDot),
                                                }}
                                            />

                                            {color.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    <td style={styles.td}>
                                        <div style={styles.actions}>

                                            <button
                                                style={{
                                                    ...styles.actionButton,
                                                    ...styles.editButton,
                                                }}
                                                title="Edit"
                                            >
                                                <Pencil size={15} />
                                            </button>

                                            <button
                                                style={{
                                                    ...styles.actionButton,
                                                    ...styles.deleteButton,
                                                }}
                                                title="Deactivate"
                                            >
                                                <Trash2 size={15} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                <div style={styles.footer}>

                    <span style={styles.resultText}>
                        Showing 1–10 of {data.length} results
                    </span>

                    <div style={styles.pagination}>

                        <button style={styles.pageButton}>
                            <ChevronLeft size={16} />
                        </button>

                        <button
                            style={{
                                ...styles.pageButton,
                                ...styles.activePage,
                            }}
                        >
                            1
                        </button>

                        <button style={styles.pageButton}>
                            <ChevronRight size={16} />
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default ColorList;
