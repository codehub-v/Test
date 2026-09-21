import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Plus,
    Pencil,
    Eye,
    PackageCheck,
    X,
} from "lucide-react";
import Pagination from "../../../components/Pagination";
import api from "../../../apis/base";

const SupplyList = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        supplier: "",
        order_date_from: "",
        order_date_to: "",
    });

    const fetchSuppliers = async () => {
        try {
            const response = await api.get("/master/meta/suppliers/");
            setSuppliers(response.data || []);
        } catch (error) {
            console.error("Failed to fetch suppliers:", error);
        }
    };

    const fetchSupplyOrders = async () => {
        try {
            setLoading(true);

            const params = {
                page: currentPage,
            };

            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params[key] = value;
                }
            });

            const response = await api.get(
                "/inventory/supply-orders/",
                { params }
            );

            setData(response.data.results || []);

            if (response.data.count) {
                const pageSize =
                    response.data.results?.length || 10;

                setTotalPages(
                    Math.ceil(response.data.count / pageSize)
                );
            } else {
                setTotalPages(1);
            }
        } catch (error) {
            console.error(
                "Failed to fetch supply orders:",
                error
            );

            setData([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        fetchSupplyOrders();
    }, [currentPage, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));

        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "",
            supplier: "",
            order_date_from: "",
            order_date_to: "",
        });

        setCurrentPage(1);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const [year, month, day] = date.split("-");

        return `${day}-${month}-${year}`;
    };

    const getStatusLabel = (status) => {
        const labels = {
            ordered: "Ordered",
            partial: "Partially Received",
            received: "Received",
            cancelled: "Cancelled",
        };

        return labels[status] || status || "-";
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

        filterTop: {
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

        filterSubtitle: {
            display: "block",
            marginTop: "3px",
            fontSize: "13px",
            color: "#64748b",
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

        filterGrid: {
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
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

        input: {
            width: "200px",
            height: "40px",
            boxSizing: "border-box",
            padding: "0 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            color: "#334155",
            background: "#ffffff",
        },

        select: {
            width: "180px",
            height: "40px",
            boxSizing: "border-box",
            padding: "0 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            color: "#334155",
            background: "#ffffff",
        },

        card: {
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
        },

        tableHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 18px",
            borderBottom: "1px solid #e2e8f0",
        },

        tableTitle: {
            margin: 0,
            fontSize: "15px",
            fontWeight: 600,
            color: "#0f172a",
        },

        count: {
            fontSize: "13px",
            color: "#64748b",
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

        number: {
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

        receiveButton: {
            border: "1px solid #dcfce7",
            background: "#f0fdf4",
            color: "#15803d",
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

        empty: {
            padding: "50px 20px",
            textAlign: "center",
            fontSize: "14px",
            color: "#94a3b8",
        },
    };

    const getStatusStyle = (status) => {
        const statusStyles = {
            ordered: {
                background: "#eff6ff",
                color: "#2563eb",
                dot: "#3b82f6",
            },
            partial: {
                background: "#fffbeb",
                color: "#b45309",
                dot: "#f59e0b",
            },
            received: {
                background: "#f0fdf4",
                color: "#15803d",
                dot: "#22c55e",
            },
            cancelled: {
                background: "#fef2f2",
                color: "#dc2626",
                dot: "#ef4444",
            },
        };

        return (
            statusStyles[status] || {
                background: "#f1f5f9",
                color: "#475569",
                dot: "#94a3b8",
            }
        );
    };

    return (
        <div style={styles.page}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Supply Orders</h1>

                    <p style={styles.subtitle}>
                        Manage supplier orders and stock receipts.
                    </p>
                </div>

                <button
                    style={styles.addButton}
                    onClick={() => navigate("/supply/add")}
                >
                    <Plus size={17} />
                    Add Supply Order
                </button>
            </div>

            {/* Filters */}
            <div style={styles.filterCard}>
                <div style={styles.filterTop}>
                    <div>
                        <h3 style={styles.filterTitle}>Filters</h3>

                        <span style={styles.filterSubtitle}>
                            Search and filter supply orders
                        </span>
                    </div>

                    <button
                        style={styles.clearButton}
                        onClick={clearFilters}
                    >
                        <X size={15} />
                        Clear Filters
                    </button>
                </div>

                <div style={styles.filterGrid}>
                    {/* Search */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Search</label>

                        <div style={styles.searchWrapper}>
                            <Search
                                size={16}
                                style={styles.searchIcon}
                            />

                            <input
                                type="text"
                                name="search"
                                placeholder="Search order or supplier..."
                                value={filters.search}
                                onChange={handleFilterChange}
                                style={styles.searchInput}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Status</label>

                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            style={styles.select}
                        >
                            <option value="">All Status</option>
                            <option value="ordered">Ordered</option>
                            <option value="partial">
                                Partially Received
                            </option>
                            <option value="received">
                                Received
                            </option>
                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>

                    {/* Supplier */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Supplier</label>

                        <select
                            name="supplier"
                            value={filters.supplier}
                            onChange={handleFilterChange}
                            style={styles.select}
                        >
                            <option value="">All Suppliers</option>

                            {suppliers.map((supplier) => (
                                <option
                                    key={supplier.id}
                                    value={supplier.id}
                                >
                                    {supplier.identity}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date From */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Order Date From
                        </label>

                        <input
                            type="date"
                            name="order_date_from"
                            value={filters.order_date_from}
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                    </div>

                    {/* Date To */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Order Date To
                        </label>

                        <input
                            type="date"
                            name="order_date_to"
                            value={filters.order_date_to}
                            onChange={handleFilterChange}
                            style={styles.input}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div style={styles.card}>
                <div style={styles.tableHeader}>
                    <h3 style={styles.tableTitle}>
                        Supply Orders
                    </h3>

                    <span style={styles.count}>
                        {data.length} order
                        {data.length !== 1 ? "s" : ""}
                    </span>
                </div>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Order Number</th>
                                <th style={styles.th}>Supplier</th>
                                <th style={styles.th}>Order Date</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={styles.empty}
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={styles.empty}
                                    >
                                        No supply orders found
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => {
                                    const statusStyle =
                                        getStatusStyle(item.status);

                                    return (
                                        <tr key={item.id}>
                                            <td
                                                style={{
                                                    ...styles.td,
                                                    ...styles.number,
                                                }}
                                            >
                                                {(currentPage - 1) *
                                                    10 +
                                                    index +
                                                    1}
                                            </td>

                                            <td style={styles.td}>
                                                <span
                                                    style={
                                                        styles.identity
                                                    }
                                                >
                                                    {item.order_number}
                                                </span>
                                            </td>

                                            <td style={styles.td}>
                                                {item.supplier_identity ||
                                                    "-"}
                                            </td>

                                            <td style={styles.td}>
                                                {formatDate(
                                                    item.order_date
                                                )}
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

                                                    {getStatusLabel(
                                                        item.status
                                                    )}
                                                </span>
                                            </td>

                                            <td style={styles.td}>
                                                <div
                                                    style={
                                                        styles.actions
                                                    }
                                                >
                                                    {/* View */}
                                                    <button
                                                        style={{
                                                            ...styles.actionButton,
                                                            ...styles.viewButton,
                                                        }}
                                                        onClick={() =>
                                                            navigate(
                                                                `/supply/details/${item.id}`
                                                            )
                                                        }
                                                        title="View Supply Order"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {/* Edit */}
                                                    {item.status !==
                                                        "received" &&
                                                        item.status !==
                                                            "cancelled" && (
                                                            <button
                                                                style={{
                                                                    ...styles.actionButton,
                                                                    ...styles.editButton,
                                                                }}
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/supply/add/${item.id}`
                                                                    )
                                                                }
                                                                title="Edit Supply Order"
                                                            >
                                                                <Pencil
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>
                                                        )}

                                                    {/* Receive */}
                                                    {item.status !==
                                                        "received" &&
                                                        item.status !==
                                                            "cancelled" && (
                                                            <button
                                                                style={{
                                                                    ...styles.actionButton,
                                                                    ...styles.receiveButton,
                                                                }}
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/supply/receive/${item.id}`
                                                                    )
                                                                }
                                                                title="Receive Stock"
                                                            >
                                                                <PackageCheck
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>
                                                        )}
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
                {!loading && data.length > 0 && (
                    <div style={styles.footer}>
                        <span style={styles.resultText}>
                            {data.length} results
                        </span>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplyList;