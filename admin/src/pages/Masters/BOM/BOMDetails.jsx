
import React, { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Package } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/base";
import "./BOMDetails.css";

const BOMDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBOM();
    }, [id]);

    const fetchBOM = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/master/bom/${id}/`);

            setData(response.data);
        } catch (error) {
            console.error("Failed to fetch BOM:", error);

            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.status === 404) {
                setError("BOM not found.");
            } else {
                setError("Unable to load BOM details.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        return status?.toLowerCase() || "inactive";
    };

    if (loading) {
        return (
            <div className="item-page">
                <div className="loading-card">
                    Loading BOM details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="item-page">
                <div className="error-card">
                    <h3>Unable to load BOM</h3>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="item-page">
            <div className="page-header">
                <div className="title-section">
                    <button
                        type="button"
                        className="back-icon-button"
                        onClick={() => navigate(-1)}
                        title="Go Back"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h2 className="page-title">
                            BOM Details
                        </h2>

                        <p className="page-subtitle">
                            View bill of materials information
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                        navigate(`/bom/add/${data.id}`)
                    }
                >
                    <Pencil size={16} />
                    Edit BOM
                </button>
            </div>

            <div className="bom-profile-card">
                <div className="bom-avatar">
                    <Package size={25} />
                </div>

                <div className="bom-profile-info">
                    <h3 className="bom-name">
                        {data.identity || "-"}
                    </h3>

                    <span
                        className={`status ${getStatusClass(
                            data.status
                        )}`}
                    >
                        <span className="status-dot" />
                        {data.status || "Inactive"}
                    </span>
                </div>
            </div>

            <div className="details-card">
                <div className="card-header">
                    <h3 className="card-title">
                        BOM Information
                    </h3>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-icon">
                            <Package size={18} />
                        </div>

                        <div>
                            <p className="label">
                                BOM Identity
                            </p>

                            <p className="value">
                                {data.identity || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">
                            <Package size={18} />
                        </div>

                        <div>
                            <p className="label">
                                Status
                            </p>

                            <p className="value">
                                <span
                                    className={`status ${getStatusClass(
                                        data.status
                                    )}`}
                                >
                                    <span className="status-dot" />
                                    {data.status || "Inactive"}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">
                            <Package size={18} />
                        </div>

                        <div>
                            <p className="label">
                                Total Items
                            </p>

                            <p className="value">
                                {data.items?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>

                {data.notes && (
                    <div className="notes-section">
                        <p className="label">
                            Notes
                        </p>

                        <p className="notes-value">
                            {data.notes}
                        </p>
                    </div>
                )}
            </div>

            <div className="details-card">
                <div className="card-header items-header">
                    <div>
                        <h3 className="card-title">
                            BOM Items
                        </h3>

                        <p className="card-subtitle">
                            Materials required for this BOM
                        </p>
                    </div>

                    <span className="item-count">
                        {data.items?.length || 0} Items
                    </span>
                </div>

                {!data.items || data.items.length === 0 ? (
                    <div className="empty-items">
                        No BOM items found.
                    </div>
                ) : (
                    <div className="items-table-wrapper">
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Type</th>
                                    <th>Material</th>
                                    <th>Color</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.items.map((item, index) => {
                                    const isFabric = Boolean(
                                        item.fabric
                                    );

                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <span
                                                    className={`material-type ${
                                                        isFabric
                                                            ? "fabric"
                                                            : "accessory"
                                                    }`}
                                                >
                                                    {isFabric
                                                        ? "Fabric"
                                                        : "Accessory"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="material-name">
                                                    {isFabric
                                                        ? item.fabric_identity
                                                        : item.accessory_identity}
                                                </span>
                                            </td>

                                            <td>
                                                {item.color_identity ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {item.unit_identity ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <strong>
                                                    {item.quantity}
                                                </strong>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BOMDetails;
