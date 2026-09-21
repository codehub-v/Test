
import React, { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/base";
import "./BOMForm.css";

const BOMForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [styles, setStyles] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [colors, setColors] = useState([]);
    const [units, setUnits] = useState([]);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        identity: "",
        status: "active",
        notes: "",
        items: [],
    });

    useEffect(() => {
        fetchMeta();

        if (isEdit) {
            fetchBOM();
        }
    }, [id]);

    /* =========================
       Fetch Meta
    ========================= */

    const fetchMeta = async () => {
        try {
            const [
                stylesResponse,
                fabricsResponse,
                accessoriesResponse,
                colorsResponse,
                unitsResponse,
            ] = await Promise.all([
                api.get("/master/meta/styles/"),
                api.get("/master/meta/fabrics/"),
                api.get("/master/meta/accessories/"),
                api.get("/master/meta/colors/"),
                api.get("/master/meta/units/"),
            ]);

            setStyles(
                stylesResponse.data.results || stylesResponse.data || []
            );

            setFabrics(
                fabricsResponse.data.results || fabricsResponse.data || []
            );

            setAccessories(
                accessoriesResponse.data.results ||
                    accessoriesResponse.data ||
                    []
            );

            setColors(
                colorsResponse.data.results || colorsResponse.data || []
            );

            setUnits(
                unitsResponse.data.results || unitsResponse.data || []
            );
        } catch (error) {
            console.error("Failed to load BOM meta:", error);
            setError("Unable to load BOM information.");
        }
    };

    /* =========================
       Fetch BOM
    ========================= */

    const fetchBOM = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/master/bom/${id}/`);

            const bom = response.data;

            setFormData({
                identity: bom.identity || "",
                status: bom.status || "active",
                notes: bom.notes || "",
                items: (bom.items || []).map((item) => ({
                    id: item.id,
                    materialType: item.fabric ? "fabric" : "accessory",
                    fabric: item.fabric || "",
                    accessory: item.accessory || "",
                    color: item.color || "",
                    unit: item.unit || "",
                    quantity: item.quantity || "",
                })),
            });
        } catch (error) {
            console.error("Failed to fetch BOM:", error);

            setError(
                error.response?.data?.detail ||
                    error.response?.data?.message ||
                    "Unable to load BOM."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       Header Change
    ========================= */

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

    /* =========================
       BOM Items
    ========================= */

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    materialType: "fabric",
                    fabric: "",
                    accessory: "",
                    color: "",
                    unit: "",
                    quantity: "",
                },
            ],
        }));
    };

    const removeItem = (index) => {
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleMaterialTypeChange = (index, value) => {
        setFormData((prev) => {
            const items = [...prev.items];

            items[index] = {
                ...items[index],
                materialType: value,
                fabric: "",
                accessory: "",
            };

            return {
                ...prev,
                items,
            };
        });
    };

    const handleItemChange = (index, field, value) => {
        setFormData((prev) => {
            const items = [...prev.items];

            items[index] = {
                ...items[index],
                [field]: value,
            };

            return {
                ...prev,
                items,
            };
        });
    };

    /* =========================
       Submit
    ========================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.identity.trim()) {
            setError("BOM identity is required.");
            return;
        }





        if (!formData.items.length) {
            setError("At least one BOM item is required.");
            return;
        }

        for (const item of formData.items) {
            if (item.materialType === "fabric" && !item.fabric) {
                setError("Please select a fabric.");
                return;
            }

            if (item.materialType === "accessory" && !item.accessory) {
                setError("Please select an accessory.");
                return;
            }

            if (!item.color) {
                setError("Color is required for every BOM item.");
                return;
            }

            if (!item.unit) {
                setError("Unit is required for every BOM item.");
                return;
            }

            if (!item.quantity || Number(item.quantity) <= 0) {
                setError("Quantity must be greater than zero.");
                return;
            }
        }

        try {
            setSaving(true);

            const payload = {
                identity: formData.identity,
                status: formData.status,
                notes: formData.notes,

                items: formData.items.map((item) => ({
                    fabric:
                        item.materialType === "fabric"
                            ? item.fabric
                            : null,

                    accessory:
                        item.materialType === "accessory"
                            ? item.accessory
                            : null,

                    color: item.color,
                    unit: item.unit,
                    quantity: item.quantity,
                })),
            };

            if (isEdit) {
                await api.put(`/master/bom/${id}/`, payload);
            } else {
                await api.post("/master/bom/", payload);
            }

            navigate("/bom");
        } catch (error) {
            console.error("Failed to save BOM:", error);

            const responseData = error.response?.data;

            if (responseData && typeof responseData === "object") {
                const message = Object.values(responseData)
                    .flat()
                    .join(" ");

                setError(message || "Failed to save BOM.");
            } else {
                setError(
                    responseData?.detail ||
                        responseData?.message ||
                        "Failed to save BOM."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    /* =========================
       Loading
    ========================= */

    if (loading) {
        return (
            <div className="bom-page">
                <div className="bom-loading-card">
                    Loading BOM details...
                </div>
            </div>
        );
    }

    return (
        <div className="bom-page">

            {/* Header */}
            <div className="bom-header">
                <div className="bom-title-section">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bom-back-button"
                        title="Go Back"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h2 className="bom-title">
                            {isEdit ? "Edit BOM" : "Add BOM"}
                        </h2>

                        <p className="bom-subtitle">
                            {isEdit
                                ? "Update bill of materials"
                                : "Create a new bill of materials"}
                        </p>
                    </div>

                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bom-error-box">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* =========================
                    BOM DETAILS
                ========================= */}

                <div className="bom-card">

                    <div className="bom-card-header">
                        <div>
                            <h3>BOM Details</h3>
                            <p>Enter the basic BOM information</p>
                        </div>
                    </div>

                    <div className="bom-form-content">

                        {/* Identity + STATUS */}
                        <div className="bom-row-two">

                            <div className="bom-form-section">
                                <label className="bom-label">
                                    BOM Identity
                                    <span className="bom-required">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="identity"
                                    value={formData.identity}
                                    onChange={handleChange}
                                    placeholder="Enter BOM identity"
                                    className="bom-input"
                                />
                            </div>
                            <div className="bom-form-section">
                                <label className="bom-label">
                                    Status
                                    <span className="bom-required">*</span>
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="bom-input"
                                >
                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>


                        </div>

                        {/* Notes */}
                        <div className="bom-form-section">
                            <label className="bom-label">
                                Notes
                            </label>

                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Enter notes"
                                rows={3}
                                className="bom-textarea"
                            />
                        </div>

                    </div>
                </div>


                {/* =========================
                    BOM ITEMS
                ========================= */}

                <div className="bom-card">

                    <div className="bom-card-header bom-items-header">

                        <div>
                            <h3>BOM Items</h3>

                            <p>
                                Add materials required for this BOM
                            </p>
                        </div>

                        <button
                            type="button"
                            className="bom-secondary-button"
                            onClick={addItem}
                        >
                            <Plus size={16} />
                            Add Item
                        </button>

                    </div>

                    {formData.items.length === 0 ? (

                        <div className="bom-no-items">

                            <span>
                                No BOM items added
                            </span>

                            <button
                                type="button"
                                className="bom-secondary-button"
                                onClick={addItem}
                            >
                                <Plus size={16} />
                                Add Item
                            </button>

                        </div>

                    ) : (

                        <div className="bom-items-container">

                            {/* Table Header */}
                            <div className="bom-item-header">

                                <span>#</span>
                                <span>Type</span>
                                <span>Material</span>
                                <span>Color</span>
                                <span>Unit</span>
                                <span>Quantity</span>
                                <span></span>

                            </div>

                            {/* Items */}
                            {formData.items.map((item, index) => (

                                <div
                                    className="bom-item-row"
                                    key={item.id || index}
                                >

                                    <div className="bom-item-number">
                                        {index + 1}
                                    </div>

                                    {/* Type */}
                                    <select
                                        value={item.materialType}
                                        onChange={(e) =>
                                            handleMaterialTypeChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="bom-item-input"
                                    >
                                        <option value="fabric">
                                            Fabric
                                        </option>

                                        <option value="accessory">
                                            Accessory
                                        </option>
                                    </select>

                                    {/* Material */}
                                    <select
                                        value={
                                            item.materialType === "fabric"
                                                ? item.fabric
                                                : item.accessory
                                        }
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                item.materialType === "fabric"
                                                    ? "fabric"
                                                    : "accessory",
                                                e.target.value
                                            )
                                        }
                                        className="bom-item-input"
                                    >
                                        <option value="">
                                            Select{" "}
                                            {item.materialType === "fabric"
                                                ? "Fabric"
                                                : "Accessory"}
                                        </option>

                                        {item.materialType === "fabric"
                                            ? fabrics.map((fabric) => (
                                                  <option
                                                      key={fabric.id}
                                                      value={fabric.id}
                                                  >
                                                      {fabric.identity}
                                                  </option>
                                              ))
                                            : accessories.map((accessory) => (
                                                  <option
                                                      key={accessory.id}
                                                      value={accessory.id}
                                                  >
                                                      {accessory.identity}
                                                  </option>
                                              ))}
                                    </select>

                                    {/* Color */}
                                    <select
                                        value={item.color}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "color",
                                                e.target.value
                                            )
                                        }
                                        className="bom-item-input"
                                    >
                                        <option value="">
                                            Color
                                        </option>

                                        {colors.map((color) => (
                                            <option
                                                key={color.id}
                                                value={color.id}
                                            >
                                                {color.identity}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Unit */}
                                    <select
                                        value={item.unit}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "unit",
                                                e.target.value
                                            )
                                        }
                                        className="bom-item-input"
                                    >
                                        <option value="">
                                            Unit
                                        </option>

                                        {units.map((unit) => (
                                            <option
                                                key={unit.id}
                                                value={unit.id}
                                            >
                                                {unit.identity}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Quantity */}
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            handleItemChange(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Qty"
                                        className="bom-item-input"
                                    />

                                    {/* Remove */}
                                    <button
                                        type="button"
                                        className="bom-remove-button"
                                        title="Remove item"
                                        onClick={() =>
                                            removeItem(index)
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                            ))}

                        </div>
                    )}

                </div>


                {/* =========================
                    FOOTER
                ========================= */}

                <div className="bom-footer">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bom-cancel-button"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className={`bom-save-button ${
                            saving ? "bom-disabled-button" : ""
                        }`}
                    >
                        <Save size={16} />

                        {saving
                            ? "Saving..."
                            : isEdit
                            ? "Update BOM"
                            : "Save BOM"}
                    </button>

                </div>

            </form>
        </div>
    );
};

export default BOMForm;
