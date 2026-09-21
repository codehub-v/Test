import React, { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/base";
import "./ProductionForm.css";

const ProductionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [boms, setBoms] = useState([]);

    const [formData, setFormData] = useState({
        production_no: "",
        product: "",
        quantity: "",
        production_line: "",
        status: "WAITING",

        cutting_date: "",
        stitching_date: "",
        sewing_date: "",
        finishing_date: "",
        completed_date: "",
        cancelled_date: "",

        remarks: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        fetchMeta();

        if (isEdit) {
            fetchProductionOrder();
        }
    }, [id]);

    const fetchMeta = async () => {
        try {
            const response = await api.get(
                "/master/meta/bom/"
            );

            setBoms(
                response.data.results ||
                    response.data ||
                    []
            );
        } catch (error) {
            console.error(
                "Failed to load BOMs:",
                error
            );

            setError(
                "Unable to load BOM information."
            );
        }
    };

    const fetchProductionOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/inventory/order/${id}/`
            );

            const data = response.data;

            setFormData({
                production_no:
                    data.production_no || "",

                product:
                    data.product_details.id || "",

                quantity:
                    data.quantity || "",

                production_line:
                    data.production_line || "",

                status:
                    data.status || "WAITING",

                cutting_date:
                    data.cutting_date || "",

                stitching_date:
                    data.stitching_date || "",

                sewing_date:
                    data.sewing_date || "",

                finishing_date:
                    data.finishing_date || "",

                completed_date:
                    data.completed_date || "",

                cancelled_date:
                    data.cancelled_date || "",

                remarks:
                    data.remarks || "",
            });
        } catch (error) {
            console.error(
                "Failed to fetch production order:",
                error
            );

            setError(
                error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Unable to load production order."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.production_no.trim()) {
            setError(
                "Production number is required."
            );
            return;
        }

        if (!formData.product) {
            setError(
                "Product / BOM is required."
            );
            return;
        }

        if (
            !formData.quantity ||
            Number(formData.quantity) <= 0
        ) {
            setError(
                "Quantity must be greater than zero."
            );
            return;
        }

        if (!formData.production_line.trim()) {
            setError(
                "Production line is required."
            );
            return;
        }

        try {
            setSaving(true);

            const payload = {
                production_no:
                    formData.production_no,

                product:
                    formData.product,

                quantity:
                    formData.quantity,

                production_line:
                    formData.production_line,

                remarks:
                    formData.remarks,
            };

            if (isEdit) {
                await api.put(
                    `/inventory/order/${id}/`,
                    payload
                );
            } else {
                await api.post(
                    "/inventory/order/",
                    payload
                );
            }

            navigate("/orders");
        } catch (error) {
            console.error(
                "Failed to save production order:",
                error
            );

            const responseData =
                error.response?.data;

            if (
                responseData &&
                typeof responseData === "object"
            ) {
                const message = Object.values(
                    responseData
                )
                    .flat()
                    .join(" ");

                setError(
                    message ||
                        "Failed to save production order."
                );
            } else {
                setError(
                    "Failed to save production order."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Not started";
        }

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="production-page">
                <div className="production-loading-card">
                    Loading production order details...
                </div>
            </div>
        );
    }

    return (
        <div className="production-page">
            <div className="production-header">
                <div className="production-title-section">
                    <button
                        type="button"
                        className="production-back-button"
                        onClick={() => navigate(-1)}
                        title="Go Back"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h2 className="production-title">
                            {isEdit
                                ? "Edit Production Order"
                                : "Add Production Order"}
                        </h2>

                        <p className="production-subtitle">
                            {isEdit
                                ? "Update production order information"
                                : "Create a new production order"}
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="production-error-box">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="production-card">
                    <div className="production-card-header">
                        <div>
                            <h3>
                                Production Order Details
                            </h3>

                            <p>
                                Enter the production order information
                            </p>
                        </div>
                    </div>

                    <div className="production-form-content">

                        {/* Production No + Product */}

                        <div className="production-row-two">
                            <div className="production-form-section">
                                <label className="production-label">
                                    Production No
                                    <span className="production-required">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="production_no"
                                    value={
                                        formData.production_no
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter production number"
                                    className="production-input"
                                />
                            </div>

                            <div className="production-form-section">
                                <label className="production-label">
                                    Product / BOM
                                    <span className="production-required">
                                        *
                                    </span>
                                </label>

                                <select
                                    name="product"
                                    value={
                                        formData.product
                                    }
                                    onChange={handleChange}
                                    className="production-input"
                                >
                                    <option value="">
                                        Select Product / BOM
                                    </option>

                                    {boms.map((bom) => (
                                        <option
                                            key={bom.id}
                                            value={bom.id}
                                        >
                                            {bom.identity}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Quantity + Production Line */}

                        <div className="production-row-two">
                            <div className="production-form-section">
                                <label className="production-label">
                                    Quantity
                                    <span className="production-required">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    value={
                                        formData.quantity
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                    className="production-input"
                                />
                            </div>

                            <div className="production-form-section">
                                <label className="production-label">
                                    Production Line
                                    <span className="production-required">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="production_line"
                                    value={
                                        formData.production_line
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter production line"
                                    className="production-input"
                                />
                            </div>
                        </div>

                        {/* Status */}

                        <div className="production-row-two">
                            <div className="production-form-section">
                                <label className="production-label">
                                    Status
                                </label>

                                <input
                                    type="text"
                                    value={
                                        formData.status
                                    }
                                    readOnly
                                    className="production-input production-readonly-input"
                                />

                                <small className="production-help-text">
                                    Status is updated automatically
                                    through the production workflow.
                                </small>
                            </div>

                            <div className="production-form-section">
                                <label className="production-label">
                                    Remarks
                                </label>

                                <textarea
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter remarks"
                                    rows={3}
                                    className="production-textarea"
                                />
                            </div>
                        </div>

                    </div>
                </div>



                <div className="production-footer">
                    <button
                        type="button"
                        className="production-cancel-button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className={`production-save-button ${
                            saving
                                ? "production-disabled-button"
                                : ""
                        }`}
                    >
                        <Save size={16} />

                        {saving
                            ? "Saving..."
                            : isEdit
                            ? "Update Production Order"
                            : "Save Production Order"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductionForm;