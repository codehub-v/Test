import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    User,
    ShoppingBag,
    MapPin,
    Truck,
    Calendar,
    FileText,
} from "lucide-react";

import api from "../../../apis/base";


const DeliveryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDelivery();
    }, [id]);

    const fetchDelivery = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                `/inventory/delivery/${id}/`
            );

            setDelivery(response.data);
        } catch (error) {
            console.error("Failed to fetch delivery:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status) => {
        const styles = {
            PACKED: {
                background: "#fff7ed",
                color: "#c2410c",
                dot: "#f97316",
            },
            DISPATCHED: {
                background: "#eff6ff",
                color: "#2563eb",
                dot: "#3b82f6",
            },
            DELIVERED: {
                background: "#f0fdf4",
                color: "#15803d",
                dot: "#22c55e",
            },
        };

        return styles[status] || {
            background: "#f1f5f9",
            color: "#475569",
            dot: "#64748b",
        };
    };

    if (loading) {
        return (
            <div style={styles.page}>
                <div style={styles.loading}>
                    Loading delivery details...
                </div>
            </div>
        );
    }

    if (!delivery) {
        return (
            <div style={styles.page}>
                <div style={styles.empty}>
                    <p>Delivery not found.</p>

                    <button
                        style={styles.backButton}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>
            </div>
        );
    }

    const production = delivery.production_details;
    const statusStyle = getStatusStyle(delivery.status);

    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <div style={styles.titleRow}>
                        <button
                            style={styles.iconBackButton}
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div>
                            <h1 style={styles.title}>
                                Delivery Details
                            </h1>

                            <p style={styles.subtitle}>
                                View complete delivery information
                            </p>
                        </div>
                    </div>
                </div>

                <div style={styles.headerActions}>
                    {delivery.status === "PACKED" && (
                        <button
                            style={styles.editButton}
                            onClick={() =>
                                navigate(
                                    `/inventory/delivery/edit/${delivery.id}`
                                )
                            }
                        >
                            Edit Delivery
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.content}>

                {/* Delivery Overview */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitleWrapper}>
                            <Package
                                size={18}
                                color="#4f46e5"
                            />

                            <h2 style={styles.cardTitle}>
                                Delivery Information
                            </h2>
                        </div>

                        <div
                            style={{
                                ...styles.statusBadge,
                                backgroundColor: statusStyle.background,
                                color: statusStyle.color,
                            }}
                        >
                            <span
                                style={{
                                    ...styles.statusDot,
                                    backgroundColor: statusStyle.dot,
                                }}
                            />

                            {delivery.status_display ||
                                delivery.status}
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.grid}>

                        <InfoItem
                            label="Delivery No"
                            value={delivery.delivery_no}
                            icon={<Package size={17} />}
                        />

                        <InfoItem
                            label="Production Order"
                            value={production?.production_no}
                            icon={<FileText size={17} />}
                        />

                        <InfoItem
                            label="Quantity"
                            value={delivery.quantity}
                            icon={<Package size={17} />}
                        />

                        <InfoItem
                            label="Vehicle Number"
                            value={delivery.vehicle_number}
                            icon={<Truck size={17} />}
                        />

                    </div>
                </div>

                {/* Production & Customer */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitleWrapper}>
                            <ShoppingBag
                                size={18}
                                color="#4f46e5"
                            />

                            <h2 style={styles.cardTitle}>
                                Production & Customer
                            </h2>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.grid}>

                        <InfoItem
                            label="Production Order"
                            value={production?.production_no}
                            icon={<Package size={17} />}
                        />

                        <InfoItem
                            label="Customer"
                            value={production?.customer?.identity}
                            icon={<User size={17} />}
                        />

                        <InfoItem
                            label="Product"
                            value={production?.product?.identity}
                            icon={<ShoppingBag size={17} />}
                        />

                        <InfoItem
                            label="Production Quantity"
                            value={production?.quantity}
                            icon={<Package size={17} />}
                        />

                    </div>
                </div>

                {/* Delivery Address */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitleWrapper}>
                            <MapPin
                                size={18}
                                color="#4f46e5"
                            />

                            <h2 style={styles.cardTitle}>
                                Delivery Address
                            </h2>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.textBox}>
                        {delivery.delivery_address || "-"}
                    </div>
                </div>

                {/* Delivery Timeline */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitleWrapper}>
                            <Calendar
                                size={18}
                                color="#4f46e5"
                            />

                            <h2 style={styles.cardTitle}>
                                Delivery Timeline
                            </h2>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.timeline}>

                        <TimelineItem
                            title="Packed"
                            date={delivery.packed_at}
                            active={!!delivery.packed_at}
                        />

                        <TimelineItem
                            title="Dispatched"
                            date={delivery.dispatched_at}
                            active={!!delivery.dispatched_at}
                        />

                        <TimelineItem
                            title="Delivered"
                            date={delivery.delivered_at}
                            active={!!delivery.delivered_at}
                            last
                        />

                    </div>
                </div>

                {/* Remarks */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardTitleWrapper}>
                            <FileText
                                size={18}
                                color="#4f46e5"
                            />

                            <h2 style={styles.cardTitle}>
                                Remarks
                            </h2>
                        </div>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.textBox}>
                        {delivery.remarks || "No remarks added."}
                    </div>
                </div>

                {/* Audit Information */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>
                            Record Information
                        </h2>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.grid}>

                        <InfoItem
                            label="Created At"
                            value={formatDate(delivery.created_at)}
                            icon={<Calendar size={17} />}
                        />

                        <InfoItem
                            label="Updated At"
                            value={formatDate(delivery.updated_at)}
                            icon={<Calendar size={17} />}
                        />

                    </div>
                </div>

            </div>
        </div>
    );
};


/* ---------------------------------------------------
   Reusable Info Item
--------------------------------------------------- */

const InfoItem = ({ label, value, icon }) => {
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


/* ---------------------------------------------------
   Timeline Item
--------------------------------------------------- */

const TimelineItem = ({
    title,
    date,
    active,
    last = false,
}) => {
    return (
        <div style={styles.timelineItem}>

            <div style={styles.timelineLeft}>

                <div
                    style={{
                        ...styles.timelineDot,
                        backgroundColor: active
                            ? "#4f46e5"
                            : "#e2e8f0",
                        borderColor: active
                            ? "#c7d2fe"
                            : "#e2e8f0",
                    }}
                />

                {!last && (
                    <div
                        style={{
                            ...styles.timelineLine,
                            backgroundColor: active
                                ? "#c7d2fe"
                                : "#e2e8f0",
                        }}
                    />
                )}

            </div>

            <div style={styles.timelineContent}>
                <div style={styles.timelineTitle}>
                    {title}
                </div>

                <div style={styles.timelineDate}>
                    {date ? formatDateValue(date) : "Not completed"}
                </div>
            </div>

        </div>
    );
};


const formatDateValue = (date) => {
    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


/* ---------------------------------------------------
   Styles
--------------------------------------------------- */

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
        marginBottom: "24px",
    },

    titleRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
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

    iconBackButton: {
        width: "38px",
        height: "38px",
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#475569",
    },

    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    editButton: {
        height: "38px",
        padding: "0 16px",
        border: "none",
        borderRadius: "7px",
        background: "#4f46e5",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
    },

    content: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        maxWidth: "1200px",
    },

    card: {
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        overflow: "hidden",
    },

    cardHeader: {
        minHeight: "58px",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
        gap: "0",
    },

    infoItem: {
        minHeight: "82px",
        padding: "18px 20px",
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
        marginBottom: "5px",
    },

    infoValue: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#0f172a",
    },

    statusBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
    },

    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
    },

    textBox: {
        padding: "18px 20px",
        fontSize: "14px",
        lineHeight: 1.6,
        color: "#334155",
        minHeight: "50px",
        whiteSpace: "pre-wrap",
    },

    timeline: {
        padding: "20px",
    },

    timelineItem: {
        display: "flex",
        minHeight: "70px",
    },

    timelineLeft: {
        width: "24px",
        position: "relative",
        display: "flex",
        justifyContent: "center",
    },

    timelineDot: {
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        border: "3px solid",
        zIndex: 1,
        marginTop: "3px",
    },

    timelineLine: {
        position: "absolute",
        top: "15px",
        bottom: "-3px",
        width: "2px",
    },

    timelineContent: {
        marginLeft: "12px",
        paddingBottom: "18px",
    },

    timelineTitle: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#0f172a",
    },

    timelineDate: {
        marginTop: "4px",
        fontSize: "12px",
        color: "#64748b",
    },

    loading: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        color: "#64748b",
        fontSize: "14px",
    },

    empty: {
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "15px",
        color: "#64748b",
    },

    backButton: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        height: "36px",
        padding: "0 14px",
        border: "1px solid #e2e8f0",
        borderRadius: "7px",
        background: "#ffffff",
        color: "#475569",
        cursor: "pointer",
        fontSize: "13px",
    },
};

export default DeliveryDetails;