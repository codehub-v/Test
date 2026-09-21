
import React, { useEffect, useState } from "react";
import {
    Eye,
    Pencil,
    Plus,
    Search,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import api from "../../../apis/base";

const BOMList = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const PAGE_SIZE = 10;

    const fetchBOMs = async () => {
        try {
            setLoading(true);

            const response = await api.get("/master/bom/", {
                params: {
                    search: search || undefined,
                    page: currentPage,
                },
            });

            setData(response.data.results || []);

            setTotalPages(
                Math.ceil(
                    (response.data.count || 0) / PAGE_SIZE
                )
            );
        } catch (error) {
            console.error("Failed to fetch BOMs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBOMs();
    }, [currentPage, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const clearSearch = () => {
        setSearch("");
        setCurrentPage(1);
    };

    const getStatusStyle = (status) => {
        const styles = {
            active: {
                background: "#f0fdf4",
                color: "#15803d",
                dot: "#22c55e",
            },
            inactive: {
                background: "#fef2f2",
                color: "#dc2626",
                dot: "#ef4444",
            },
            draft: {
                background: "#fffbeb",
                color: "#b45309",
                dot: "#f59e0b",
            },
        };

        return (
            styles[status?.toLowerCase()] || {
                background: "#f1f5f9",
                color: "#475569",
                dot: "#94a3b8",
            }
        );
    };

    const styles = {
        page: {
            minHeight: "100vh",
            background: "#f8fafc",
            padding: "24px",
            fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
            fontWeight: 650,
            color: "#0f172a",
        },

        subtitle: {
            margin: "5px 0 0",
            fontSize: "14px",
            color: "#64748b",
        },

        addButton: {
            display: "flex",
            alignItems: "center",
            gap: "7px",
            height: "40px",
            padding: "0 16px",
            border: "none",
            borderRadius: "8px",
            background: "#4f46e5",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
        },

        filterCard: {
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "20px",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
        },

        filterHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
        },

        filterTitle: {
            margin: 0,
            fontSize: "15px",
            fontWeight: 600,
            color: "#0f172a",
        },

        clearButton: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "40px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#475569",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
        },

        formGroup: {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
        },

        label: {
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
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
        },

        searchInput: {
            width: "100%",
            height: "40px",
            boxSizing: "border-box",
            padding: "0 12px 0 38px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            color: "#334155",
            background: "#ffffff",
        },

        tableCard: {
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
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
            fontWeight: 600,
            color: "#64748b",
            background: "#f8fafc",
            whiteSpace: "nowrap",
        },

        td: {
            padding: "15px 18px",
            fontSize: "14px",
            color: "#334155",
            borderTop: "1px solid #f1f5f9",
            whiteSpace: "nowrap",
        },

        serial: {
            color: "#94a3b8",
            fontSize: "13px",
        },

        identity: {
            fontWeight: 600,
            color: "#0f172a",
        },

        status: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 9px",
            borderRadius: "20px",
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
            gap: "6px",
        },

        actionButton: {
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "7px",
            cursor: "pointer",
        },

        viewButton: {
            border: "1px solid #ccfbf1",
            background: "#f0fdfa",
            color: "#0f766e",
        },

        editButton: {
            border: "1px solid #e0e7ff",
            background: "#eef2ff",
            color: "#4f46e5",
        },

        emptyRow: {
            padding: "50px 20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#94a3b8",
        },

        footer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px",
            borderTop: "1px solid #e2e8f0",
        },

        resultText: {
            fontSize: "13px",
            color: "#64748b",
        },
    };

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>BOM</h1>

                    <p style={styles.subtitle}>
                        Manage bill of materials
                    </p>
                </div>

                <button
                    style={styles.addButton}
                    onClick={() => navigate("/bom/add")}
                >
                    <Plus size={17} />
                    Add BOM
                </button>
            </div>

            {/* Search Filter */}
            <div style={styles.filterCard}>
                <div style={styles.filterHeader}>
                    <div>
                        <h3 style={styles.filterTitle}>
                            Search
                        </h3>
                    </div>

                    {search && (
                        <button
                            style={styles.clearButton}
                            onClick={clearSearch}
                        >
                            <X size={15} />
                            Clear
                        </button>
                    )}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        Search
                    </label>

                    <div style={styles.searchWrapper}>
                        <Search
                            size={16}
                            style={styles.searchIcon}
                        />

                        <input
                            type="text"
                            placeholder="Search BOM ..."
                            value={search}
                            onChange={handleSearch}
                            style={styles.searchInput}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div style={styles.tableCard}>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>S.No</th>
                                <th style={styles.th}>BOM</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Created At</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={styles.emptyRow}
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        style={styles.emptyRow}
                                    >
                                        No BOM found
                                    </td>
                                </tr>
                            ) : (
                                data.map((bom, index) => {
                                    const statusStyle =
                                        getStatusStyle(
                                            bom.status
                                        );

                                    return (
                                        <tr key={bom.id}>
                                            <td
                                                style={{
                                                    ...styles.td,
                                                    ...styles.serial,
                                                }}
                                            >
                                                {(currentPage -
                                                    1) *
                                                    PAGE_SIZE +
                                                    index +
                                                    1}
                                            </td>

                                            <td style={styles.td}>
                                                <span
                                                    style={
                                                        styles.identity
                                                    }
                                                >
                                                    {bom.identity}
                                                </span>
                                            </td>



                                            <td style={styles.td}>
                                                <span
                                                    style={{
                                                        ...styles.status,
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

                                                    {bom.status}
                                                </span>
                                            </td>

                                            <td style={styles.td}>
                                                {bom.created_at
                                                    ? new Date(
                                                          bom.created_at
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td style={styles.td}>
                                                <div
                                                    style={
                                                        styles.actions
                                                    }
                                                >
                                                    <button
                                                        type="button"
                                                        style={{
                                                            ...styles.actionButton,
                                                            ...styles.viewButton,
                                                        }}
                                                        title="View"
                                                        onClick={() =>
                                                            navigate(
                                                                `/bom/details/${bom.id}`
                                                            )
                                                        }
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        style={{
                                                            ...styles.actionButton,
                                                            ...styles.editButton,
                                                        }}
                                                        title="Edit"
                                                        onClick={() =>
                                                            navigate(
                                                                `/bom/add/${bom.id}`
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={16}
                                                        />
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

                {/* Footer */}
                <div style={styles.footer}>
                    <div style={styles.resultText}>

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

export default BOMList;
