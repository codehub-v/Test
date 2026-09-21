import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../apis/base";


const DeliveryForm = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [productionOrders, setProductionOrders] = useState([]);

    const [formData, setFormData] = useState({
        delivery_no: "",
        production_order: "",
        quantity: "",
        delivery_address: "",
        vehicle_number: "",
        remarks: "",
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // Fetch completed production orders
    const fetchProductionOrders = async () => {

        try {

            const response = await api.get(
                "/inventory/meta/order/"
            );

            const orders = response.data.results ||
                response.data ||
                [];

            // Only completed production orders
            const completedOrders = orders.filter(
                (order) =>
                    order.status === "COMPLETED"
            );

            setProductionOrders(completedOrders);

        } catch (error) {

            console.error(
                "Error fetching production orders:",
                error
            );

        }
    };


    // Fetch delivery when editing
    const fetchDelivery = async () => {

        if (!id) {
            return;
        }

        try {

            setLoading(true);

            const response = await api.get(
                `/inventory/delivery/${id}/`
            );

            const data = response.data;

            setFormData({
                delivery_no: data.delivery_no || "",
                production_order:
                    data.production_details?.id ||
                    data.production_order ||
                    "",
                quantity: data.quantity || "",
                delivery_address:
                    data.delivery_address || "",
                vehicle_number:
                    data.vehicle_number || "",
                remarks: data.remarks || "",
            });

        } catch (error) {

            console.error(
                "Error fetching delivery:",
                error
            );

            setError(
                "Unable to load delivery."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchProductionOrders();

        if (isEdit) {
            fetchDelivery();
        }

    }, [id]);


    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    const selectedProductionOrder =
        productionOrders.find(
            (order) =>
                String(order.id) ===
                String(formData.production_order)
        );


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!formData.production_order) {

            setError(
                "Please select a production order."
            );

            return;
        }

        if (!formData.quantity) {

            setError(
                "Please enter delivery quantity."
            );

            return;
        }

        try {

            setSaving(true);

            const payload = {
                delivery_no:
                    formData.delivery_no,

                production_order:
                    formData.production_order,

                quantity:
                    Number(formData.quantity),

                delivery_address:
                    formData.delivery_address,

                vehicle_number:
                    formData.vehicle_number,

                remarks:
                    formData.remarks,
            };

            if (isEdit) {

                await api.put(
                    `/inventory/delivery/${id}/`,
                    payload
                );

            } else {

                await api.post(
                    "/inventory/delivery/",
                    payload
                );

            }

            navigate("/deliveries");

        } catch (error) {

            console.error(
                "Error saving delivery:",
                error
            );

            setError(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to save delivery."
            );

        } finally {

            setSaving(false);

        }
    };


    if (loading) {

        return (
            <div style={styles.page}>
                <div style={styles.loading}>
                    Loading...
                </div>
            </div>
        );

    }


    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header}>

                <div style={styles.titleSection}>

                    <h2 style={styles.title}>
                        {isEdit
                            ? "Edit Delivery"
                            : "Add Delivery"}
                    </h2>

                    <p style={styles.subtitle}>
                        {isEdit
                            ? "Update delivery details"
                            : "Create a delivery from completed production"}
                    </p>

                </div>

            </div>


            {/* Form Card */}
            <div style={styles.card}>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    <div style={styles.formGrid}>

                        {/* Delivery Number */}
                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Delivery Number
                            </label>

                            <input
                                type="text"
                                name="delivery_no"
                                value={
                                    formData.delivery_no
                                }
                                onChange={handleChange}
                                placeholder="Enter delivery number"
                                style={styles.input}
                                required
                            />

                        </div>


                        {/* Production Order */}
                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Production Order
                            </label>

                            <select
                                name="production_order"
                                value={
                                    formData.production_order
                                }
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >

                                <option value="">
                                    Select production order
                                </option>

                                {productionOrders.map(
                                    (order) => (

                                        <option
                                            key={order.id}
                                            value={order.id}
                                        >
                                            {order.production_no}
                                            {order.product_name
                                                ? ` - ${order.product_name}`
                                                : ""}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* Customer */}
                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Customer
                            </label>

                            <input
                                type="text"
                                value={
                                    selectedProductionOrder
                                        ?.customer_name ||
                                    selectedProductionOrder
                                        ?.customer_details
                                        ?.identity ||
                                    ""
                                }
                                placeholder="Customer"
                                style={{
                                    ...styles.input,
                                    backgroundColor:
                                        "#f8fafc",
                                }}
                                disabled
                            />

                        </div>


                        {/* Quantity */}
                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                max={
                                    selectedProductionOrder
                                        ?.quantity || undefined
                                }
                                value={
                                    formData.quantity
                                }
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                style={styles.input}
                                required
                            />

                            {selectedProductionOrder && (
                                <span style={styles.helpText}>
                                    Production quantity:{" "}
                                    {
                                        selectedProductionOrder.quantity
                                    }
                                </span>
                            )}

                        </div>


                        {/* Delivery Address */}
                        <div
                            style={{
                                ...styles.formGroup,
                                gridColumn: "1 / -1",
                            }}
                        >

                            <label style={styles.label}>
                                Delivery Address
                            </label>

                            <textarea
                                name="delivery_address"
                                value={
                                    formData.delivery_address
                                }
                                onChange={handleChange}
                                placeholder="Enter delivery address"
                                rows="3"
                                style={{
                                    ...styles.input,
                                    resize: "vertical",
                                }}
                            />

                        </div>


                        {/* Vehicle Number */}
                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Vehicle Number
                            </label>

                            <input
                                type="text"
                                name="vehicle_number"
                                value={
                                    formData.vehicle_number
                                }
                                onChange={handleChange}
                                placeholder="Enter vehicle number"
                                style={styles.input}
                            />

                        </div>


                        {/* Remarks */}
                        <div style={styles.formGroup}>

                            <label style={styles.label}>
                                Remarks
                            </label>

                            <input
                                type="text"
                                name="remarks"
                                value={
                                    formData.remarks
                                }
                                onChange={handleChange}
                                placeholder="Enter remarks"
                                style={styles.input}
                            />

                        </div>

                    </div>


                    {/* Buttons */}
                    <div style={styles.footer}>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/deliveries")
                            }
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            style={styles.saveButton}
                        >
                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Update Delivery"
                                    : "Create Delivery"}
                        </button>

                    </div>

                </form>

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

    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "24px",
        boxShadow:
            "0 1px 3px rgba(15, 23, 42, 0.04)",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
        gap: "20px",
    },

    formGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "7px",
    },

    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#475569",
    },

    input: {
        width: "100%",
        height: "40px",
        boxSizing: "border-box",
        padding: "10px 12px",
        border: "1px solid #dbe1ea",
        borderRadius: "8px",
        outline: "none",
        fontSize: "14px",
        color: "#334155",
        backgroundColor: "#ffffff",
    },

    helpText: {
        fontSize: "12px",
        color: "#64748b",
    },

    error: {
        marginBottom: "20px",
        padding: "12px 14px",
        borderRadius: "8px",
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        fontSize: "14px",
    },

    footer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "24px",
        paddingTop: "20px",
        borderTop: "1px solid #f1f5f9",
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

    saveButton: {
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

    loading: {
        padding: "50px",
        textAlign: "center",
        color: "#64748b",
    },
};


export default DeliveryForm;