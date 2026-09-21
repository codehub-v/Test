
import React, { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Eye,
    X,
    Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../../components/Pagination";
import api from "../../../apis/base";


const ProductionList = () => {

    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [productionLine, setProductionLine] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);


    const fetchProductions = async () => {

        try {

            setLoading(true);

            const params = {
                page: currentPage,
            };

            if (search) {
                params.search = search;
            }

            if (status) {
                params.status = status;
            }

            if (productionLine) {
                params.production_line = productionLine;
            }

            const response = await api.get(
                "inventory/order/",
                { params }
            );

            setData(
                response.data.results || []
            );

            setTotalPages(
                Math.ceil(
                    (response.data.count || 0) / 10
                )
            );

        } catch (error) {

            console.error(
                "Error fetching production orders:",
                error
            );

            setData([]);
            setTotalPages(1);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProductions();

    }, [
        currentPage,
        search,
        status,
        productionLine,
    ]);


    const handleClear = () => {

        setSearch("");
        setStatus("");
        setProductionLine("");
        setCurrentPage(1);

    };


    const handleView = (id) => {

        navigate(`/orders/detials/${id}`);

    };


    const handleEdit = (id) => {

        navigate(`/orders/add/${id}`);

    };


    const handleStart = async (id) => {

        try {

            await api.post(
                `inventory/order/${id}/start/`
            );

            fetchProductions();

        } catch (error) {

            console.error(
                "Error starting production:",
                error
            );

            alert(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to start production."
            );

        }

    };


    const getStatusLabel = (status) => {

        const labels = {
            WAITING: "Waiting",
            CUTTING: "Cutting",
            STITCHING: "Stitching",
            SEWING: "Sewing",
            FINISHING: "Finishing",
            COMPLETED: "Completed",
        };

        return labels[status] || status || "-";

    };


    const getStatusStyle = (status) => {

        const styles = {

            WAITING: {
                backgroundColor: "#fff7ed",
                color: "#c2410c",
                dot: "#f97316",
            },

            CUTTING: {
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                dot: "#3b82f6",
            },

            STITCHING: {
                backgroundColor: "#f5f3ff",
                color: "#7c3aed",
                dot: "#8b5cf6",
            },

            SEWING: {
                backgroundColor: "#eef2ff",
                color: "#4338ca",
                dot: "#6366f1",
            },

            FINISHING: {
                backgroundColor: "#f0fdfa",
                color: "#0f766e",
                dot: "#14b8a6",
            },

            COMPLETED: {
                backgroundColor: "#ecfdf3",
                color: "#15803d",
                dot: "#22c55e",
            },

        };

        return styles[status] || {
            backgroundColor: "#f8fafc",
            color: "#64748b",
            dot: "#94a3b8",
        };

    };


    return (

        <div style={styles.page}>

            {/* Header */}

            <div style={styles.header}>

                <div style={styles.titleSection}>

                    <h2 style={styles.title}>
                        Production
                    </h2>

                    <p style={styles.subtitle}>
                        Manage production orders and track production status
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/orders/add")
                    }
                    style={styles.addButton}
                >

                    <Plus size={18} />

                    Add Production

                </button>

            </div>


            {/* Filter Card */}

            <div style={styles.filterCard}>

                {/* Search */}

                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Search
                    </label>

                    <div style={styles.searchWrapper}>

                        <Search
                            size={17}
                            style={styles.searchIcon}
                        />

                        <input
                            type="text"
                            placeholder="Search production..."
                            value={search}
                            onChange={(e) => {

                                setSearch(
                                    e.target.value
                                );

                                setCurrentPage(1);

                            }}
                            style={styles.searchInput}
                        />

                    </div>

                </div>


                {/* Status */}

                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) => {

                            setStatus(
                                e.target.value
                            );

                            setCurrentPage(1);

                        }}
                        style={styles.select}
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="WAITING">
                            Waiting
                        </option>

                        <option value="CUTTING">
                            Cutting
                        </option>

                        <option value="STITCHING">
                            Stitching
                        </option>

                        <option value="SEWING">
                            Sewing
                        </option>

                        <option value="FINISHING">
                            Finishing
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                    </select>

                </div>


                {/* Production Line */}

                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Production Line
                    </label>

                    <input
                        type="text"
                        placeholder="Production line..."
                        value={productionLine}
                        onChange={(e) => {

                            setProductionLine(
                                e.target.value
                            );

                            setCurrentPage(1);

                        }}
                        style={styles.normalInput}
                    />

                </div>


                {/* Clear */}

                <button
                    type="button"
                    onClick={handleClear}
                    style={styles.clearButton}
                >

                    <X size={16} />

                    Clear

                </button>

            </div>


            {/* Table Card */}

            <div style={styles.card}>

                <div style={styles.tableWrapper}>

                    <table style={styles.table}>

                        <thead>

                            <tr>

                                <th style={styles.th}>
                                    #
                                </th>

                                <th style={styles.th}>
                                    Production No
                                </th>

                                <th style={styles.th}>
                                    Product
                                </th>

                                <th style={styles.th}>
                                    Quantity
                                </th>

                                <th style={styles.th}>
                                    Production Line
                                </th>

                                <th style={styles.th}>
                                    Status
                                </th>

                                <th style={styles.th}>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={styles.empty}
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : data.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={styles.empty}
                                    >
                                        No production orders found
                                    </td>

                                </tr>

                            ) : (

                                data.map(
                                    (production, index) => {

                                        const statusStyle =
                                            getStatusStyle(
                                                production.status
                                            );

                                        return (

                                            <tr
                                                key={
                                                    production.id
                                                }
                                            >

                                                {/* Number */}

                                                <td
                                                    style={{
                                                        ...styles.td,
                                                        color: "#94a3b8",
                                                    }}
                                                >

                                                    {(currentPage - 1) *
                                                        10 +
                                                        index +
                                                        1}

                                                </td>


                                                {/* Production Number */}

                                                <td
                                                    style={styles.td}
                                                >

                                                    <span
                                                        style={
                                                            styles.identity
                                                        }
                                                    >

                                                        {
                                                            production.production_no
                                                        }

                                                    </span>

                                                </td>


                                                {/* Product */}

                                                <td
                                                    style={styles.td}
                                                >

                                                    {
                                                        production.product_name ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* Quantity */}

                                                <td
                                                    style={styles.td}
                                                >

                                                    {
                                                        production.quantity
                                                    }

                                                </td>


                                                {/* Production Line */}

                                                <td
                                                    style={styles.td}
                                                >

                                                    {
                                                        production.production_line ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* Status */}

                                                <td
                                                    style={styles.td}
                                                >

                                                    <span
                                                        style={{
                                                            ...styles.status,
                                                            backgroundColor:
                                                                statusStyle.backgroundColor,
                                                            color:
                                                                statusStyle.color,
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                ...styles.statusDot,
                                                                backgroundColor:
                                                                    statusStyle.dot,
                                                            }}
                                                        />

                                                        {
                                                            production.status_display ||
                                                            getStatusLabel(
                                                                production.status
                                                            )
                                                        }

                                                    </span>

                                                </td>


                                                {/* Actions */}

                                                <td
                                                    style={styles.td}
                                                >

                                                    <div
                                                        style={
                                                            styles.actions
                                                        }
                                                    >

                                                        {/* View */}

                                                        <button
                                                            onClick={() =>
                                                                handleView(
                                                                    production.id
                                                                )
                                                            }
                                                            style={{
                                                                ...styles.actionButton,
                                                                ...styles.viewButton,
                                                            }}
                                                            title="View Production"
                                                        >

                                                            <Eye
                                                                size={16}
                                                            />

                                                        </button>


                                                        {/* Edit */}

                                                        {production.status ===
                                                            "WAITING" && (

                                                            <button
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        production.id
                                                                    )
                                                                }
                                                                style={{
                                                                    ...styles.actionButton,
                                                                    ...styles.editButton,
                                                                }}
                                                                title="Edit Production"
                                                            >

                                                                <Pencil
                                                                    size={16}
                                                                />

                                                            </button>

                                                        )}


                                                        {/* Start */}

                                                        {production.status ===
                                                            "WAITING" && (

                                                            <button
                                                                onClick={() =>
                                                                    handleStart(
                                                                        production.id
                                                                    )
                                                                }
                                                                style={{
                                                                    ...styles.actionButton,
                                                                    ...styles.startButton,
                                                                }}
                                                                title="Start Production"
                                                            >

                                                                <Play
                                                                    size={15}
                                                                />

                                                            </button>

                                                        )}

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* Footer */}

                <div style={styles.footer}>

                    <span style={styles.resultText}>
                        {data.length} results
                    </span>

                    <Pagination
                        currentPage={
                            currentPage
                        }
                        totalPages={
                            totalPages > 0
                                ? totalPages
                                : 1
                        }
                        onPageChange={
                            setCurrentPage
                        }
                    />

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

    filterCard: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "18px",
        display: "flex",
        alignItems: "flex-end",
        gap: "16px",
        marginBottom: "20px",
        boxShadow:
            "0 1px 3px rgba(15, 23, 42, 0.04)",
    },

    filterGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
    },

    filterLabel: {
        fontSize: "13px",
        fontWeight: "600",
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
        pointerEvents: "none",
    },

    searchInput: {
        width: "320px",
        height: "40px",
        boxSizing: "border-box",
        padding: "10px 12px 10px 38px",
        border: "1px solid #dbe1ea",
        borderRadius: "8px",
        outline: "none",
        fontSize: "14px",
        color: "#334155",
    },

    normalInput: {
        width: "200px",
        height: "40px",
        boxSizing: "border-box",
        padding: "10px 12px",
        border: "1px solid #dbe1ea",
        borderRadius: "8px",
        outline: "none",
        fontSize: "14px",
        color: "#334155",
    },

    select: {
        width: "160px",
        height: "40px",
        padding: "0 12px",
        border: "1px solid #dbe1ea",
        borderRadius: "8px",
        outline: "none",
        fontSize: "14px",
        color: "#475569",
        backgroundColor: "#ffffff",
        cursor: "pointer",
    },

    clearButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        height: "40px",
        padding: "0 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#64748b",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },

    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow:
            "0 1px 3px rgba(15, 23, 42, 0.04)",
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
        whiteSpace: "nowrap",
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
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        backgroundColor: "#ffffff",
        cursor: "pointer",
    },

    viewButton: {
        color: "#0f766e",
        backgroundColor: "#f0fdfa",
        border: "1px solid #ccfbf1",
    },

    editButton: {
        color: "#4f46e5",
    },

    startButton: {
        color: "#15803d",
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
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

    empty: {
        padding: "50px 20px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: "14px",
    },

};


export default ProductionList;
