import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle, AlertCircle } from "lucide-react";
import "./ItemForm.css";

const ItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [masterData, setMasterData] = useState({
    fabrics: [],
    accessories: [],
    colors: [],
    units: [],
  });

  const [itemType, setItemType] = useState("");

  const [formData, setFormData] = useState({
    // code: "",
    fabric: "",
    accessory: "",
    color: "",
    unit: "",
    quantity: "",
    is_active: true,
  });

  const headers = {
    Authorization: `Token ${localStorage.getItem("token")}`,
  };


  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const fetchMasterData = async () => {
    try {
      setLoading(true);

      const [fabricResponse, accessoryResponse, colorResponse, unitResponse] =
        await Promise.all([
          axios.get("http://127.0.0.1:8000/master/meta/fabrics/", { headers }),

          axios.get("http://127.0.0.1:8000/master/meta/accessories/", {
            headers,
          }),

          axios.get("http://127.0.0.1:8000/master/meta/colors/", { headers }),

          axios.get("http://127.0.0.1:8000/master/meta/units/", { headers }),
        ]);

      setMasterData({
        fabrics: fabricResponse.data.results || fabricResponse.data,

        accessories: accessoryResponse.data.results || accessoryResponse.data,

        colors: colorResponse.data.results || colorResponse.data,

        units: unitResponse.data.results || unitResponse.data,
      });
    } catch (error) {
      console.error("Failed to fetch master data:", error);

      setErrorMessage(
        "Unable to load inventory form data. Please refresh the page and try again.",
      );
    } finally {
      setLoading(false);
    }
  };


  const fetchItem = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `http://127.0.0.1:8000/inventory/items/${id}/`,
        { headers },
      );

      const item = response.data;

      if (item.fabric_details) {
        setItemType("fabric");
      } else if (item.accessory_details) {
        setItemType("accessory");
      } else {
        setItemType("");
      }

      setFormData({
        // code: item.code || "",

        fabric: item.fabric_details?.id || "",

        accessory: item.accessory_details?.id || "",

        color: item.color_details?.id || "",

        unit: item.unit_details?.id || "",

        quantity: item.quantity ?? 0,
        is_active: item.is_active ?? true,
      });
    } catch (error) {
      console.error("Failed to fetch inventory item:", error);

      setErrorMessage("Unable to load the inventory item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchItem();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    clearMessages();

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleItemTypeChange = (type) => {

    if (isEdit) {
      return;
    }

    clearMessages();

    setItemType(type);


    setFormData((prev) => ({
      ...prev,

      fabric: type === "fabric" ? prev.fabric : "",

      accessory: type === "accessory" ? prev.accessory : "",
    }));
  };

  const handleStatusChange = (e) => {
    clearMessages();

    setFormData((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };

  const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
      return "Unable to connect to the server. Please try again.";
    }



    if (typeof data === "object") {

      // if (data.code) {
      //   const codeError = Array.isArray(data.code) ? data.code[0] : data.code;

      //   if (String(codeError).toLowerCase().includes("already exists")) {
      //     return "This item code is already in use. Please enter a different code.";
      //   }

      //   return `Item code: ${codeError}`;
      // }


      if (data.non_field_errors || data.detail) {
        const message = data.non_field_errors || data.detail;

        const text = Array.isArray(message) ? message[0] : message;

        const lowerText = String(text).toLowerCase();



        if (
          lowerText.includes("unique_inventory_item") ||
          lowerText.includes("already exists") ||
          lowerText.includes("unique")
        ) {
          return "An inventory item with the same material, color and unit already exists.";
        }

        return String(text);
      }

      if (data.fabric) {
        const message = Array.isArray(data.fabric)
          ? data.fabric[0]
          : data.fabric;

        return `Fabric: ${message}`;
      }


      if (data.accessory) {
        const message = Array.isArray(data.accessory)
          ? data.accessory[0]
          : data.accessory;

        return `Accessory: ${message}`;
      }


      if (data.color) {
        const message = Array.isArray(data.color) ? data.color[0] : data.color;

        return `Color: ${message}`;
      }


      if (data.unit) {
        const message = Array.isArray(data.unit) ? data.unit[0] : data.unit;

        return `Unit: ${message}`;
      }


      if (data.is_active) {
        const message = Array.isArray(data.is_active)
          ? data.is_active[0]
          : data.is_active;

        return `Status: ${message}`;
      }


      const messages = Object.entries(data)
        .map(([field, value]) => {
          const message = Array.isArray(value) ? value.join(", ") : value;

          return `${field}: ${message}`;
        })
        .join("\n");

      if (messages) {
        return messages;
      }
    }



    if (typeof data === "string") {
      return data;
    }

    return "Unable to save the inventory item. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearMessages();

    // if (!formData.code.trim()) {
    //   setErrorMessage("Item code is required.");
    //   return;
    // }

    if (!itemType) {
      setErrorMessage("Please select either Fabric or Accessory.");
      return;
    }

    if (itemType === "fabric" && !formData.fabric) {
      setErrorMessage("Please select a fabric for this inventory item.");
      return;
    }

    if (itemType === "accessory" && !formData.accessory) {
      setErrorMessage("Please select an accessory for this inventory item.");
      return;
    }

    if (!formData.color) {
      setErrorMessage("Please select a color.");
      return;
    }

    if (!formData.unit) {
      setErrorMessage("Please select a unit.");
      return;
    }

    // if (!formData.code.trim()) {
    //   setErrorMessage("Item code is required.");

    //   return;
    // }

    if (!itemType) {
      setErrorMessage("Please select either Fabric or Accessory.");

      return;
    }

    if (itemType === "fabric" && !formData.fabric) {
      setErrorMessage("Please select a fabric for this inventory item.");

      return;
    }

    if (itemType === "accessory" && !formData.accessory) {
      setErrorMessage("Please select an accessory for this inventory item.");

      return;
    }

    if (!formData.color) {
      setErrorMessage("Please select a color.");

      return;
    }

    if (!formData.unit) {
      setErrorMessage("Please select a unit.");

      return;
    }

    try {
      setSaving(true);

      const payload = {
        // code: formData.code.trim(),

        fabric: itemType === "fabric" ? formData.fabric : null,

        accessory: itemType === "accessory" ? formData.accessory : null,

        color: formData.color,

        unit: formData.unit,
        quantity: formData.quantity,

        is_active: formData.is_active,
      };

      if (isEdit) {
        await axios.put(
          `http://127.0.0.1:8000/inventory/items/${id}/`,
          payload,
          { headers },
        );

        setSuccessMessage("Inventory item updated successfully.");
      } else {
        await axios.post("http://127.0.0.1:8000/inventory/items/", payload, {
          headers,
        });

        setSuccessMessage("Inventory item created successfully.");
      }


      setTimeout(() => {
        navigate("/items");
      }, 1000);
    } catch (error) {
      console.error("Failed to save inventory item:", error);

      setErrorMessage(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="item-form-page">

      <div className="item-form-header">
        <div className="item-form-title-section">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/items")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2>{isEdit ? "Edit Inventory Item" : "Add Inventory Item"}</h2>

            <p>
              {isEdit
                ? "Update inventory item details"
                : "Create a new inventory item"}
            </p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="form-alert success-alert">
          <CheckCircle size={18} />

          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="form-alert error-alert">
          <AlertCircle size={18} />

          <span>{errorMessage}</span>
        </div>
      )}


      <div className="item-form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <div className="section-header">
              <h3>Item Details</h3>

              <span>Enter the inventory item information</span>
            </div>

            <div className="form-grid">

              {/* <div className="form-group">
                <label>
                  Item Code <span>*</span>
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter item code"
                  disabled={loading || saving}
                  required
                />
              </div> */}

              <div className="form-group">
                <label>Status</label>

                <div className="status-toggle-wrapper">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={handleStatusChange}
                      disabled={loading || saving}
                    />

                    <span className="slider" />
                  </label>

                  <span className="toggle-label">
                    {formData.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="form-group full-width">
                <label>
                  Item Type <span>*</span>
                </label>

                <div className="radio-group">
                  {/* Fabric */}

                  <label
                    className={`
                                            radio-card
                                            ${
                                              itemType === "fabric"
                                                ? "selected"
                                                : ""
                                            }
                                            ${isEdit ? "disabled" : ""}
                                        `}
                  >
                    <input
                      type="radio"
                      name="item_type"
                      value="fabric"
                      checked={itemType === "fabric"}
                      onChange={() => handleItemTypeChange("fabric")}
                      disabled={isEdit || loading || saving}
                    />

                    <span className="radio-circle" />

                    <div>
                      <strong>Fabric</strong>

                      <small>Raw fabric material</small>
                    </div>
                  </label>

                  {/* Accessory */}

                  <label
                    className={`
                                            radio-card
                                            ${
                                              itemType === "accessory"
                                                ? "selected"
                                                : ""
                                            }
                                            ${isEdit ? "disabled" : ""}
                                        `}
                  >
                    <input
                      type="radio"
                      name="item_type"
                      value="accessory"
                      checked={itemType === "accessory"}
                      onChange={() => handleItemTypeChange("accessory")}
                      disabled={isEdit || loading || saving}
                    />

                    <span className="radio-circle" />

                    <div>
                      <strong>Accessory</strong>

                      <small>Garment accessory</small>
                    </div>
                  </label>
                </div>

                {isEdit && (
                  <small>Item type cannot be changed after creation.</small>
                )}
              </div>


              {itemType === "fabric" && (
                <div className="form-group">
                  <label>
                    Fabric <span>*</span>
                  </label>

                  <select
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleChange}
                    disabled={loading || saving}
                    required
                  >
                    <option value="">Select Fabric</option>

                    {masterData.fabrics.map((fabric) => (
                      <option key={fabric.id} value={fabric.id}>
                        {fabric.identity}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              {itemType === "accessory" && (
                <div className="form-group">
                  <label>
                    Accessory <span>*</span>
                  </label>

                  <select
                    name="accessory"
                    value={formData.accessory}
                    onChange={handleChange}
                    disabled={loading || saving}
                    required
                  >
                    <option value="">Select Accessory</option>

                    {masterData.accessories.map((accessory) => (
                      <option key={accessory.id} value={accessory.id}>
                        {accessory.identity}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>
                  Color <span>*</span>
                </label>

                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  disabled={loading || saving}
                  required
                >
                  <option value="">Select Color</option>

                  {masterData.colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.identity}
                    </option>
                  ))}
                </select>
              </div>


              <div className="form-group">
                <label>
                  Unit <span>*</span>
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  disabled={loading || saving}
                  required
                >
                  <option value="">Select Unit</option>

                  {masterData.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.identity}
                    </option>
                  ))}
                </select>

              </div>
              <div className="form-group">

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
          </div>

          <div className="form-info">
            <strong>Inventory Item</strong>

            <p>
              An inventory item is identified by its material, color and unit.
              Select either Fabric or Accessory.
            </p>
          </div>


          <div className="form-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/items")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={saving || loading}
            >
              <Save size={17} />

              {saving ? "Saving..." : isEdit ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
