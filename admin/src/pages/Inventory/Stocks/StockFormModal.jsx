
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    X,
    Save,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import "./StockFormModal.css";

const StockFormModal = ({
    isOpen,
    onClose,
    stockId = null,
    onSuccess,
}) => {
    const isEdit = Boolean(stockId);

    const [items, setItems] = useState([]);

    const [formData, setFormData] = useState({
        item: "",
        quantity: "",
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [itemName, setItemName]=useState("");

    const headers = {
        Authorization: `Token ${localStorage.getItem("token")}`,
    };



    const resetForm = () => {
        setFormData({
            item: "",
            quantity: "",
        });

        setErrorMessage("");
        setSuccessMessage("");
    };



    const fetchItems = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://127.0.0.1:8000/inventory/meta/items/",
                {
                    headers,
                }
            );

            setItems(
                response.data.results ||
                response.data ||
                []
            );

        } catch (error) {
            console.error(
                "Failed to fetch inventory items:",
                error
            );

            setErrorMessage(
                "Unable to load inventory items. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };



    const fetchStock = async () => {

        if (!stockId) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.get(
                `http://127.0.0.1:8000/inventory/stock/${stockId}/`,
                {
                    headers,
                }
            );

            const stock = response.data;
            setItemName(stock.item)

            setFormData({
                item: stock.item_id || stock.item?.id || "",
                quantity: stock.quantity ?? "",
            });

        } catch (error) {
            console.error(
                "Failed to fetch stock:",
                error
            );

            setErrorMessage(
                "Unable to load stock details. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {

        if (!isOpen) {
            return;
        }

        resetForm();

        fetchItems();

        if (stockId) {
            fetchStock();
        }

    }, [isOpen, stockId]);



    const handleChange = (e) => {

        const { name, value } = e.target;

        setErrorMessage("");
        setSuccessMessage("");

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    const getErrorMessage = (error) => {

        const data = error.response?.data;

        if (!data) {
            return "Unable to connect to the server. Please try again.";
        }

        if (typeof data === "string") {
            return data;
        }

        if (data.detail) {
            return Array.isArray(data.detail)
                ? data.detail[0]
                : data.detail;
        }

        if (data.non_field_errors) {
            return Array.isArray(data.non_field_errors)
                ? data.non_field_errors[0]
                : data.non_field_errors;
        }

        if (data.item) {
            return `Inventory Item: ${
                Array.isArray(data.item)
                    ? data.item[0]
                    : data.item
            }`;
        }

        if (data.quantity) {
            return `Quantity: ${
                Array.isArray(data.quantity)
                    ? data.quantity[0]
                    : data.quantity
            }`;
        }

        const firstError = Object.values(data)[0];

        if (Array.isArray(firstError)) {
            return firstError[0];
        }

        if (typeof firstError === "string") {
            return firstError;
        }

        return "Unable to save stock. Please try again.";
    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");



        if (!formData.item) {

            setErrorMessage(
                "Please select an inventory item."
            );

            return;
        }


        if (
            formData.quantity === "" ||
            formData.quantity === null
        ) {

            setErrorMessage(
                "Quantity is required."
            );

            return;
        }


        if (Number(formData.quantity) < 0) {

            setErrorMessage(
                "Quantity cannot be negative."
            );

            return;
        }



        try {

            setSaving(true);

            const payload = {
                item: formData.item,
                quantity: formData.quantity,
            };


            if (isEdit) {

                await axios.put(
                    `http://127.0.0.1:8000/inventory/stock/${stockId}/`,
                    payload,
                    {
                        headers,
                    }
                );

                setSuccessMessage(
                    "Stock updated successfully."
                );

            } else {

                await axios.post(
                    "http://127.0.0.1:8000/inventory/stock/",
                    payload,
                    {
                        headers,
                    }
                );

                setSuccessMessage(
                    "Stock created successfully."
                );
            }


            if (onSuccess) {
                onSuccess();
            }


            setTimeout(() => {
                onClose();
            }, 700);

        } catch (error) {

            console.error(
                "Failed to save stock:",
                error
            );

            setErrorMessage(
                getErrorMessage(error)
            );

        } finally {
            setSaving(false);
        }
    };


    if (!isOpen) {
        return null;
    }


    return (
        <div
            className="stock-modal-overlay"
            onMouseDown={(e) => {

                if (
                    e.target === e.currentTarget &&
                    !saving
                ) {
                    onClose();
                }

            }}
        >

            <div className="stock-modal">


                <div className="stock-modal-header">

                    <div>

                        <h2>
                            {isEdit
                                ? "Edit Stock"
                                : "Add Stock"}
                        </h2>

                        <p>
                            {isEdit
                                ? "Update stock quantity"
                                : "Add stock for an inventory item"}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="stock-modal-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        <X size={18} />
                    </button>

                </div>


                {successMessage && (
                    <div className="stock-form-message success">

                        <CheckCircle size={17} />

                        <span>
                            {successMessage}
                        </span>

                    </div>
                )}


                {errorMessage && (
                    <div className="stock-form-message error">

                        <AlertCircle size={17} />

                        <span>
                            {errorMessage}
                        </span>

                    </div>
                )}



                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="stock-modal-body">

                        {/* Item */}

                        <div className="stock-form-group">

                            <label>
                                Inventory Item
                                <span>*</span>
                            </label>

                            <select
                                name="item"
                                value={formData.item}
                                onChange={handleChange}
                                disabled={
                                    loading ||
                                    saving ||
                                    isEdit
                                }
                            >

                                <option value="">
                                    {isEdit?itemName:"Select inventory item"}
                                </option>

                                {items.map((item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.material_name}
                                        {/* {" - "}
                                        {item.color}
                                        {" - "}
                                        {item.unit} */}
                                    </option>

                                ))}

                            </select>

                            {isEdit && (
                                <small>
                                    Inventory item cannot be
                                    changed after stock creation.
                                </small>
                            )}

                        </div>


                        {/* Quantity */}

                        <div className="stock-form-group">

                            <label>
                                Quantity
                                <span>*</span>
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                min="0"
                                step="0.01"
                                disabled={
                                    loading ||
                                    saving
                                }
                            />

                        </div>

                    </div>


                    {/* =========================
                        Footer
                    ========================= */}

                    <div className="stock-modal-footer">

                        <button
                            type="button"
                            className="stock-cancel-button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="stock-save-button"
                            disabled={
                                loading ||
                                saving
                            }
                        >

                            <Save size={16} />

                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Update Stock"
                                    : "Save Stock"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default StockFormModal;

