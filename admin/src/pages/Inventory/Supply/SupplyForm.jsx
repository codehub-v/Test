import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../apis/base";
import "./SupplyForm.css";

const SupplyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const today = new Date().toISOString().split("T")[0];

  const [suppliers, setSuppliers] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [colors, setColors] = useState([]);
  const [units, setUnits] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    supplier: "",
    order_date: today,
    status: "ordered",
    notes: "",
    items: [
      {
        fabric: "",
        accessory: "",
        color: "",
        unit: "",
        ordered_quantity: "",
      },
    ],
  });

  // =========================
  // Load Data
  // =========================

  useEffect(() => {
    fetchDropdownData();

    if (isEdit) {
      fetchSupplyOrder();
    }
  }, [id]);

  // =========================
  // Dropdown Data
  // =========================

  const fetchDropdownData = async () => {
    try {
      const [
        supplierResponse,
        fabricResponse,
        accessoryResponse,
        colorResponse,
        unitResponse,
      ] = await Promise.all([
        api.get("/master/meta/suppliers/"),
        api.get("/master/meta/fabrics/"),
        api.get("/master/meta/accessories/"),
        api.get("/master/meta/colors/"),
        api.get("/master/meta/units/"),
      ]);

      setSuppliers(supplierResponse.data.results || supplierResponse.data);

      setFabrics(fabricResponse.data.results || fabricResponse.data);

      setAccessories(accessoryResponse.data.results || accessoryResponse.data);

      setColors(colorResponse.data.results || colorResponse.data);

      setUnits(unitResponse.data.results || unitResponse.data);
    } catch (error) {
      console.error("Failed to load dropdown data:", error);
    }
  };

  // =========================
  // Fetch Existing Order
  // =========================

  const fetchSupplyOrder = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/inventory/supply-orders/${id}/`);

      const order = response.data;

      setFormData({
        supplier: order.supplier || "",
        order_date: order.order_date || today,
        status: order.status || "ordered",
        notes: order.notes || "",

        items: order.items?.map((item) => ({
          id: item.id,
          fabric: item.fabric || "",
          accessory: item.accessory || "",
          color: item.color || "",
          unit: item.unit || "",
          ordered_quantity: item.ordered_quantity || "",
          received_quantity: item.received_quantity || 0,
        })) || [
          {
            fabric: "",
            accessory: "",
            color: "",
            unit: "",
            ordered_quantity: "",
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch supply order:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Main Form Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // Item Change
  // =========================

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const items = [...prev.items];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      // Fabric and accessory are mutually exclusive
      if (field === "fabric" && value) {
        items[index].accessory = "";
      }

      if (field === "accessory" && value) {
        items[index].fabric = "";
      }

      return {
        ...prev,
        items,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [`item_${index}_${field}`]: "",
    }));
  };

  // =========================
  // Add Item
  // =========================

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,

      items: [
        ...prev.items,
        {
          fabric: "",
          accessory: "",
          color: "",
          unit: "",
          ordered_quantity: "",
        },
      ],
    }));
  };

  // =========================
  // Remove Item
  // =========================

  const removeItem = (index) => {
    if (formData.items.length === 1) {
      return;
    }

    setFormData((prev) => ({
      ...prev,

      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  // =========================
  // Validation
  // =========================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier) {
      newErrors.supplier = "Please select a supplier.";
    }

    if (!formData.order_date) {
      newErrors.order_date = "Order date is required.";
    }

    if (!formData.items.length) {
      newErrors.items = "At least one supply item is required.";
    }

    formData.items.forEach((item, index) => {
      if (!item.fabric && !item.accessory) {
        newErrors[`item_${index}_material`] =
          "Select either fabric or accessory.";
      }

      if (!item.color) {
        newErrors[`item_${index}_color`] = "Please select a color.";
      }

      if (!item.unit) {
        newErrors[`item_${index}_unit`] = "Please select a unit.";
      }

      if (!item.ordered_quantity || Number(item.ordered_quantity) <= 0) {
        newErrors[`item_${index}_quantity`] =
          "Enter a quantity greater than 0.";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        supplier: Number(formData.supplier),

        order_date: formData.order_date,

        notes: formData.notes,

        items: formData.items.map((item) => ({
          fabric: item.fabric ? Number(item.fabric) : null,

          accessory: item.accessory ? Number(item.accessory) : null,

          color: Number(item.color),

          unit: Number(item.unit),

          ordered_quantity: item.ordered_quantity,
        })),
      };

      /*
       * New order:
       * Backend default = ordered
       *
       * Edit:
       * Only Ordered / Cancelled can be changed.
       */
      if (isEdit) {
        payload.status = formData.status;
      }

      if (isEdit) {
        await api.put(`/inventory/supply-orders/${id}/`, payload);
      } else {
        await api.post("/inventory/supply-orders/", payload);
      }

      navigate("/supply");
    } catch (error) {
      console.error("Failed to save supply order:", error);

      const responseData = error.response?.data;

      if (responseData && typeof responseData === "object") {
        setErrors({
          general:
            responseData.detail ||
            responseData.message ||
            "Unable to save supply order.",
        });
      } else {
        setErrors({
          general: "Unable to save supply order. Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="item-page">
        <div className="table-card">
          <div className="table-message">Loading supply order...</div>
        </div>
      </div>
    );
  }

  // =========================
  // Render
  // =========================

  return (
    <div className="item-page">
      {/* Header */}

      <div className="page-header">
        <div>
          <h1>{isEdit ? "Edit Supply Order" : "Add Supply Order"}</h1>

          <p>
            {isEdit
              ? "Update supply order details"
              : "Create a new supplier order"}
          </p>
        </div>

        <button
          type="button"
          className="secondary-btn"
          onClick={() => navigate("/supply")}
        >
          Back
        </button>
      </div>

      {/* General Error */}

      {errors.general && <div className="form-error">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        {/* =========================
                    Order Details
                ========================= */}

        <div className="form-card">
          <div className="form-card-header">
            <div>
              <h3>Order Details</h3>

              <span>Enter supplier and order information</span>
            </div>
          </div>

          <div className="form-grid">
            {/* Supplier */}

            <div className="form-group">
              <label>
                Supplier
                <span className="required">*</span>
              </label>

              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
              >
                <option value="">Select Supplier</option>

                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.identity}
                  </option>
                ))}
              </select>

              {errors.supplier && (
                <small style={{ color: "red" }}>{errors.supplier}</small>
              )}
            </div>

            {/* Order Date */}

            <div className="form-group">
              <label>
                Order Date
                <span className="required">*</span>
              </label>

              <input
                type="date"
                name="order_date"
                value={formData.order_date}
                onChange={handleChange}
                disabled={isEdit}
              />

              {errors.order_date && (
                <small className="field-error">{errors.order_date}</small>
              )}
            </div>

            {/* Status - Edit Only */}

            {isEdit && (
              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ordered">Ordered</option>

                  <option value="cancelled">Cancelled</option>
                </select>

                <small className="field-hint">
                  Partial and Received status are updated through stock receipt.
                </small>
              </div>
            )}

            {/* Notes */}

            <div className="form-group full-width">
              <label>Notes</label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any additional notes..."
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* =========================
                    Supply Items
                ========================= */}

        <div className="form-card">
          <div className="form-card-header item-header">
            <div>
              <h3>Supply Items</h3>

              <span>Add the materials required from the supplier</span>
            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addItem}
              disabled={
                isEdit &&
                formData.items.some(
                  (item) => Number(item.received_quantity) > 0,
                )
              }
            >
              + Add Item
            </button>
          </div>

          {errors.items && <div className="form-error">{errors.items}</div>}

          <div className="items-table-wrapper">
            <table className="items-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fabric</th>
                  <th>Accessory</th>
                  <th>Color</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {formData.items.map((item, index) => {
                  const hasReceived = Number(item.received_quantity) > 0;

                  return (
                    <tr key={index}>
                      {/* Number */}

                      <td className="item-number">{index + 1}</td>

                      {/* Fabric */}

                      <td>
                        <select
                          value={item.fabric}
                          onChange={(e) =>
                            handleItemChange(index, "fabric", e.target.value)
                          }
                          disabled={Boolean(item.accessory) || hasReceived}
                        >
                          <option value="">Select Fabric</option>

                          {fabrics.map((fabric) => (
                            <option key={fabric.id} value={fabric.id}>
                              {fabric.identity}
                            </option>
                          ))}
                        </select>

                        {errors[`item_${index}_material`] && (
                          <small className="field-error">
                            {errors[`item_${index}_material`]}
                          </small>
                        )}
                      </td>

                      {/* Accessory */}

                      <td>
                        <select
                          value={item.accessory}
                          onChange={(e) =>
                            handleItemChange(index, "accessory", e.target.value)
                          }
                          disabled={Boolean(item.fabric) || hasReceived}
                        >
                          <option value="">Select Accessory</option>

                          {accessories.map((accessory) => (
                            <option key={accessory.id} value={accessory.id}>
                              {accessory.identity}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Color */}

                      <td>
                        <select
                          value={item.color}
                          onChange={(e) =>
                            handleItemChange(index, "color", e.target.value)
                          }
                          disabled={hasReceived}
                        >
                          <option value="">Select Color</option>

                          {colors.map((color) => (
                            <option key={color.id} value={color.id}>
                              {color.identity}
                            </option>
                          ))}
                        </select>

                        {errors[`item_${index}_color`] && (
                          <small className="field-error">
                            {errors[`item_${index}_color`]}
                          </small>
                        )}
                      </td>

                      {/* Unit */}

                      <td>
                        <select
                          value={item.unit}
                          onChange={(e) =>
                            handleItemChange(index, "unit", e.target.value)
                          }
                          disabled={hasReceived}
                        >
                          <option value="">Select Unit</option>

                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.identity}
                            </option>
                          ))}
                        </select>

                        {errors[`item_${index}_unit`] && (
                          <small className="field-error">
                            {errors[`item_${index}_unit`]}
                          </small>
                        )}
                      </td>

                      {/* Quantity */}

                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.ordered_quantity}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "ordered_quantity",
                              e.target.value,
                            )
                          }
                          placeholder="0.00"
                          disabled={hasReceived}
                        />

                        {errors[`item_${index}_quantity`] && (
                          <small className="field-error">
                            {errors[`item_${index}_quantity`]}
                          </small>
                        )}
                      </td>

                      {/* Remove */}

                      <td>
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeItem(index)}
                          disabled={formData.items.length === 1 || hasReceived}
                          title="Remove item"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}

        <div className="form-footer">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/supply")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn" disabled={saving}>
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Supply Order"
                : "Create Supply Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplyForm;
