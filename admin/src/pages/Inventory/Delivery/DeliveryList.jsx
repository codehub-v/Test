
import React, { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Eye,
    Pencil,
    X,
    Truck,
    CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../../apis/base";
import Pagination from "../../../components/Pagination";


const DeliveryList = () => {

    const navigate = useNavigate();

    const [data, setData] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        type: "",
        delivery: null,
    });


    // =========================
    // Fetch Deliveries
    // =========================

    const fetchDeliveries = async () => {

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

            const response = await api.get(
                "/inventory/delivery/",
                {
                    params,
                }
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
                "Error fetching deliveries:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchDeliveries();

    }, [
        currentPage,
        search,
        status,
    ]);


    // =========================
    // Clear Filters
    // =========================

    const handleClear = () => {

        setSearch("");
        setStatus("");
        setCurrentPage(1);

    };


    // =========================
    // Navigation
    // =========================

    const handleEdit = (id) => {

        navigate(
            `/deliveries/add/${id}`
        );

    };


    const handleView = (id) => {

        navigate(
            `/deliveries/details/${id}`
        );

    };


    // =========================
    // Open Confirmation Modal
    // =========================

    const handleDispatch = (delivery) => {

        setConfirmModal({
            open: true,
            type: "DISPATCH",
            delivery,
        });

    };


    const handleComplete = (delivery) => {

        setConfirmModal({
            open: true,
            type: "COMPLETE",
            delivery,
        });

    };


    // =========================
    // Close Confirmation Modal
    // =========================

    const closeConfirmModal = () => {

        setConfirmModal({
            open: false,
            type: "",
            delivery: null,
        });

    };


    // =========================
    // Confirm Status Change
    // =========================

    const confirmStatusChange = async () => {

        const delivery =
            confirmModal.delivery;

        if (!delivery) {
            return;
        }

        try {

            if (
                confirmModal.type ===
                "DISPATCH"
            ) {

                await api.post(
                    `/inventory/delivery/${delivery.id}/dispatch/`
                );

            } else if (
                confirmModal.type ===
                "COMPLETE"
            ) {

                await api.post(
                    `/inventory/delivery/${delivery.id}/completed/`
                );

            }

            closeConfirmModal();

            fetchDeliveries();

        } catch (error) {

            console.error(
                "Error changing delivery status:",
                error
            );

        }

    };


    // =========================
    // Status Styles
    // =========================

    const getStatusStyle = (
        deliveryStatus
    ) => {

        switch (deliveryStatus) {

            case "PACKED":

                return {
                    backgroundColor: "#fff7ed",
                    color: "#c2410c",
                };

            case "DISPATCHED":

                return {
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                };

            case "DELIVERED":

                return {
                    backgroundColor: "#ecfdf3",
                    color: "#15803d",
                };

            default:

                return {
                    backgroundColor: "#f1f5f9",
                    color: "#64748b",
                };
        }
    };


    const getStatusDot = (
        deliveryStatus
    ) => {

        switch (deliveryStatus) {

            case "PACKED":

                return {
                    backgroundColor: "#f97316",
                };

            case "DISPATCHED":

                return {
                    backgroundColor: "#3b82f6",
                };

            case "DELIVERED":

                return {
                    backgroundColor: "#22c55e",
                };

            default:

                return {
                    backgroundColor: "#94a3b8",
                };
        }
    };


    // =========================
    // Modal Status Information
    // =========================

    const oldStatus =
        confirmModal.type === "DISPATCH"
            ? "PACKED"
            : "DISPATCHED";

    const newStatus =
        confirmModal.type === "DISPATCH"
            ? "DISPATCHED"
            : "DELIVERED";


    const oldStatusDisplay =
        confirmModal.type === "DISPATCH"
            ? "Packed"
            : "Dispatched";

    const newStatusDisplay =
        confirmModal.type === "DISPATCH"
            ? "Dispatched"
            : "Delivered";

    const changedField =
        confirmModal.type === "DISPATCH"
            ? "Dispatched At"
            : "Delivered At";


    return (
        <div style={styles.page}>

            {/* =========================
                Header
            ========================= */}

            <div style={styles.header}>

                <div style={styles.titleSection}>

                    <h2 style={styles.title}>
                        Deliveries
                    </h2>

                    <p style={styles.subtitle}>
                        Manage production order deliveries
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/deliveries/add/"
                        )
                    }
                    style={styles.addButton}
                >

                    <Plus size={18} />

                    Add Delivery

                </button>

            </div>


            {/* =========================
                Filter Card
            ========================= */}

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
                            placeholder="Search delivery or production no..."
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

                        <option value="PACKED">
                            Packed
                        </option>

                        <option value="DISPATCHED">
                            Dispatched
                        </option>

                        <option value="DELIVERED">
                            Delivered
                        </option>

                    </select>

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


            {/* =========================
                Table Card
            ========================= */}

            <div style={styles.card}>

                <div style={styles.tableWrapper}>

                    <table style={styles.table}>

                        <thead>

                            <tr>

                                <th style={styles.th}>
                                    #
                                </th>

                                <th style={styles.th}>
                                    Delivery
                                </th>

                                <th style={styles.th}>
                                    Production Order
                                </th>

                                <th style={styles.th}>
                                    Customer
                                </th>

                                <th style={styles.th}>
                                    Product
                                </th>

                                <th style={styles.th}>
                                    Quantity
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
                                        colSpan="8"
                                        style={styles.empty}
                                    >
                                        Loading deliveries...
                                    </td>

                                </tr>

                            ) : data.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={styles.empty}
                                    >
                                        No deliveries found
                                    </td>

                                </tr>

                            ) : (

                                data.map(
                                    (
                                        delivery,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                delivery.uuid ||
                                                delivery.id
                                            }
                                        >

                                            {/* Serial Number */}

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    color: "#94a3b8",
                                                }}
                                            >

                                                {
                                                    (currentPage - 1) *
                                                        10 +
                                                    index +
                                                    1
                                                }

                                            </td>


                                            {/* Delivery */}

                                            <td style={styles.td}>

                                                <div
                                                    style={
                                                        styles.deliveryInfo
                                                    }
                                                >

                                                    <span
                                                        style={
                                                            styles.identity
                                                        }
                                                    >
                                                        {
                                                            delivery.delivery_no
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* Production */}

                                            <td
                                                style={styles.td}
                                            >
                                                {
                                                    delivery.production_no ||
                                                    "-"
                                                }
                                            </td>


                                            {/* Customer */}

                                            <td
                                                style={styles.td}
                                            >
                                                {
                                                    delivery.customer_name ||
                                                    "-"
                                                }
                                            </td>


                                            {/* Product */}

                                            <td
                                                style={styles.td}
                                            >
                                                {
                                                    delivery.product_name ||
                                                    "-"
                                                }
                                            </td>


                                            {/* Quantity */}

                                            <td
                                                style={styles.td}
                                            >
                                                {
                                                    delivery.quantity ??
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
                                                        ...getStatusStyle(
                                                            delivery.status
                                                        ),
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            ...styles.statusDot,
                                                            ...getStatusDot(
                                                                delivery.status
                                                            ),
                                                        }}
                                                    />

                                                    {
                                                        delivery.status_display ||
                                                        delivery.status
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
                                                                delivery.id
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.actionButton,
                                                            ...styles.viewButton,
                                                        }}
                                                        title="View Delivery"
                                                    >
                                                        <Eye
                                                            size={16}
                                                        />
                                                    </button>


                                                    {/* Edit */}

                                                    {delivery.status ===
                                                        "PACKED" && (

                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    delivery.id
                                                                )
                                                            }
                                                            style={{
                                                                ...styles.actionButton,
                                                                ...styles.editButton,
                                                            }}
                                                            title="Edit"
                                                        >

                                                            <Pencil
                                                                size={16}
                                                            />

                                                        </button>

                                                    )}


                                                    {/* Dispatch */}

                                                    {delivery.status ===
                                                        "PACKED" && (

                                                        <button
                                                            onClick={() =>
                                                                handleDispatch(
                                                                    delivery
                                                                )
                                                            }
                                                            style={{
                                                                ...styles.actionButton,
                                                                ...styles.dispatchButton,
                                                            }}
                                                            title="Dispatch"
                                                        >

                                                            <Truck
                                                                size={16}
                                                            />

                                                        </button>

                                                    )}


                                                    {/* Complete */}

                                                    {delivery.status ===
                                                        "DISPATCHED" && (

                                                        <button
                                                            onClick={() =>
                                                                handleComplete(
                                                                    delivery
                                                                )
                                                            }
                                                            style={{
                                                                ...styles.actionButton,
                                                                ...styles.completeButton,
                                                            }}
                                                            title="Mark as Delivered"
                                                        >

                                                            <CheckCircle
                                                                size={16}
                                                            />

                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
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


            {/* =========================
                Confirmation Modal
            ========================= */}

            {confirmModal.open && (

                <div style={styles.modalOverlay}>

                    <div style={styles.modal}>

                        {/* Modal Header */}

                        <div
                            style={
                                styles.modalHeader
                            }
                        >

                            <div>

                                <h3
                                    style={
                                        styles.modalTitle
                                    }
                                >
                                    Confirm Status Change
                                </h3>

                                <p
                                    style={
                                        styles.modalSubtitle
                                    }
                                >
                                    Review the changes before continuing
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeConfirmModal
                                }
                                style={
                                    styles.modalClose
                                }
                            >

                                <X size={18} />

                            </button>

                        </div>


                        {/* Modal Body */}

                        <div
                            style={
                                styles.modalBody
                            }
                        >

                            {/* Delivery */}

                            <div
                                style={
                                    styles.detailRow
                                }
                            >

                                <span
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Delivery
                                </span>

                                <span
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {
                                        confirmModal
                                            .delivery
                                            ?.delivery_no ||
                                        "-"
                                    }
                                </span>

                            </div>


                            {/* Production Order */}

                            <div
                                style={
                                    styles.detailRow
                                }
                            >

                                <span
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Production Order
                                </span>

                                <span
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {
                                        confirmModal
                                            .delivery
                                            ?.production_no ||
                                        "-"
                                    }
                                </span>

                            </div>


                            {/* Customer */}

                            <div
                                style={
                                    styles.detailRow
                                }
                            >

                                <span
                                    style={
                                        styles.detailLabel
                                    }
                                >
                                    Customer
                                </span>

                                <span
                                    style={
                                        styles.detailValue
                                    }
                                >
                                    {
                                        confirmModal
                                            .delivery
                                            ?.customer_name ||
                                        "-"
                                    }
                                </span>

                            </div>


                            {/* Status Change */}

                            <div
                                style={
                                    styles.statusChangeBox
                                }
                            >

                                <div
                                    style={
                                        styles.statusChangeTitle
                                    }
                                >
                                    Status Change
                                </div>


                                <div
                                    style={
                                        styles.statusChange
                                    }
                                >

                                    <span
                                        style={{
                                            ...styles.modalStatus,
                                            ...getStatusStyle(
                                                oldStatus
                                            ),
                                        }}
                                    >
                                        {oldStatusDisplay}
                                    </span>


                                    <span
                                        style={
                                            styles.arrow
                                        }
                                    >
                                        →
                                    </span>


                                    <span
                                        style={{
                                            ...styles.modalStatus,
                                            ...getStatusStyle(
                                                newStatus
                                            ),
                                        }}
                                    >
                                        {newStatusDisplay}
                                    </span>

                                </div>

                            </div>


                            {/* Model Changes */}

                            <div
                                style={
                                    styles.changesBox
                                }
                            >

                                <div
                                    style={
                                        styles.changesTitle
                                    }
                                >
                                    The following will be updated
                                </div>


                                {/* Status */}

                                <div
                                    style={
                                        styles.changeItem
                                    }
                                >

                                    <span>
                                        Status
                                    </span>

                                    <strong
                                        style={
                                            styles.changeValue
                                        }
                                    >
                                        {newStatus}
                                    </strong>

                                </div>


                                {/* DateTime */}

                                <div
                                    style={
                                        styles.changeItem
                                    }
                                >

                                    <span>
                                        {changedField}
                                    </span>

                                    <strong
                                        style={
                                            styles.changeValue
                                        }
                                    >
                                        Current date & time
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div
                            style={
                                styles.modalFooter
                            }
                        >

                            <button
                                type="button"
                                onClick={
                                    closeConfirmModal
                                }
                                style={
                                    styles.cancelButton
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    confirmStatusChange
                                }
                                style={
                                    styles.confirmButton
                                }
                            >

                                {confirmModal.type ===
                                    "DISPATCH"
                                    ? "Confirm Dispatch"
                                    : "Confirm Delivery"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

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


    deliveryInfo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
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


    dispatchButton: {
        color: "#2563eb",
        backgroundColor: "#eff6ff",
        border: "1px solid #dbeafe",
    },


    completeButton: {
        color: "#15803d",
        backgroundColor: "#ecfdf3",
        border: "1px solid #dcfce7",
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


    // =========================
    // Confirmation Modal
    // =========================

    modalOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor:
            "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
    },


    modal: {
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow:
            "0 20px 40px rgba(15, 23, 42, 0.15)",
        overflow: "hidden",
    },


    modalHeader: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "20px 22px",
        borderBottom:
            "1px solid #e2e8f0",
    },


    modalTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "600",
        color: "#0f172a",
    },


    modalSubtitle: {
        margin: "4px 0 0",
        fontSize: "13px",
        color: "#64748b",
    },


    modalClose: {
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        backgroundColor: "#ffffff",
        color: "#64748b",
        cursor: "pointer",
    },


    modalBody: {
        padding: "20px 22px",
    },


    detailRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom:
            "1px solid #f1f5f9",
    },


    detailLabel: {
        fontSize: "13px",
        color: "#64748b",
    },


    detailValue: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#0f172a",
    },


    statusChangeBox: {
        marginTop: "18px",
        padding: "15px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
    },


    statusChangeTitle: {
        fontSize: "12px",
        fontWeight: "600",
        color: "#64748b",
        marginBottom: "10px",
    },


    statusChange: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },


    modalStatus: {
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "500",
    },


    arrow: {
        color: "#94a3b8",
        fontSize: "18px",
    },


    changesBox: {
        marginTop: "16px",
        padding: "15px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
    },


    changesTitle: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#475569",
        marginBottom: "10px",
    },


    changeItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "7px 0",
        fontSize: "13px",
        color: "#64748b",
    },


    changeValue: {
        color: "#0f172a",
        fontWeight: "600",
    },


    modalFooter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "10px",
        padding: "16px 22px",
        borderTop:
            "1px solid #f1f5f9",
    },


    cancelButton: {
        height: "40px",
        padding: "0 16px",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#64748b",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },


    confirmButton: {
        height: "40px",
        padding: "0 18px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#4f46e5",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    },
};


export default DeliveryList;