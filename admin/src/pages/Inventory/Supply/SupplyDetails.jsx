import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, ArrowLeft } from "lucide-react";
import "./SupplyDetails.css";
import api from "../../../apis/base";

const SupplyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSupplyOrder();
    }, [id]);

    const fetchSupplyOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/inventory/supply-orders/${id}/`
            );

            setData(response.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.detail ||
                "Failed to load supply order details."
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "ordered":
                return "ordered";

            case "partial":
                return "partial";

            case "received":
                return "received";

            case "cancelled":
                return "cancelled";

            default:
                return "ordered";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "ordered":
                return "Ordered";

            case "partial":
                return "Partially Received";

            case "received":
                return "Received";

            case "cancelled":
                return "Cancelled";

            default:
                return status;
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return date;
        }

        return value.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatDateTime = (date) => {
        if (!date) return "-";

        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            return date;
        }

        return value.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="item-page">
                <div className="details-message">
                    Loading supply order details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="item-page">
                <div className="details-message error-message">
                    {error}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="item-page">
                <div className="details-message">
                    Supply order not found.
                </div>
            </div>
        );
    }

    return (
        <div className="item-page">

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1>Supply Order Details</h1>
                    <p>
                        View complete information about this supply order
                    </p>
                </div>

                <div className="header-actions">
                    <button
                        className="secondary-btn"
                        onClick={() => navigate("/supply")}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    {data.status !== "received" &&
                        data.status !== "cancelled" && (
                            <button
                                className="primary-btn"
                                onClick={() =>
                                    navigate(`/supply/add/${data.id}`)
                                }
                            >
                                <Pencil size={16} />
                                Edit
                            </button>
                        )}
                </div>
            </div>

            {/* Order Information */}
            <div className="details-card">

                <div className="details-card-header">
                    <div>
                        <h3>Order Information</h3>
                        <span>
                            Basic information about this supply order
                        </span>
                    </div>

                    <span
                        className={`status ${getStatusClass(
                            data.status
                        )}`}
                    >
                        <span className="status-dot"></span>
                        {getStatusLabel(data.status)}
                    </span>
                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <label>Order Number</label>
                        <strong>{data.order_number || "-"}</strong>
                    </div>

                    <div className="detail-item">
                        <label>Supplier</label>
                        <strong>
                            {data.supplier_identity || "-"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <label>Order Date</label>
                        <strong>
                            {formatDate(data.order_date)}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <label>Status</label>
                        <strong>
                            {getStatusLabel(data.status)}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <label>Created At</label>
                        <strong>
                            {formatDateTime(data.created_at)}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <label>Last Updated</label>
                        <strong>
                            {formatDateTime(data.updated_at)}
                        </strong>
                    </div>

                    <div className="detail-item full-width">
                        <label>Notes</label>
                        <p className="detail-text">
                            {data.notes || "No notes added."}
                        </p>
                    </div>

                </div>
            </div>

            {/* Items */}
            <div className="details-card">

                <div className="details-card-header">
                    <div>
                        <h3>Supply Items</h3>
                        <span>
                            Materials included in this supply order
                        </span>
                    </div>

                    <span className="item-count">
                        {data.items?.length || 0} Items
                    </span>
                </div>

                <div className="table-wrapper">

                    <table>

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Material Type</th>
                                <th>Material</th>
                                <th>Color</th>
                                <th>Unit</th>
                                <th>Ordered Qty</th>
                                <th>Received Qty</th>
                                <th>Remaining Qty</th>
                            </tr>
                        </thead>

                        <tbody>

                            {data.items?.length > 0 ? (
                                data.items.map((item, index) => {

                                    const material = item.fabric
                                        ? item.fabric_identity
                                        : item.accessory
                                            ? item.accessory_identity
                                            : "-";

                                    const materialType = item.fabric
                                        ? "Fabric"
                                        : item.accessory
                                            ? "Accessory"
                                            : "-";

                                    return (
                                        <tr key={item.id}>

                                            <td className="td-number">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <span className="material-type">
                                                    {materialType}
                                                </span>
                                            </td>

                                            <td>
                                                <strong className="identity">
                                                    {material}
                                                </strong>
                                            </td>

                                            <td>
                                                {item.color_identity || "-"}
                                            </td>

                                            <td>
                                                {item.unit_identity || "-"}
                                            </td>

                                            <td className="quantity">
                                                {item.ordered_quantity}
                                            </td>

                                            <td className="quantity received-quantity">
                                                {item.received_quantity}
                                            </td>

                                            <td className="quantity">
                                                {item.remaining_quantity}
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="table-message"
                                    >
                                        No items found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
};

export default SupplyDetails;