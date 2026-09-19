import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, PackageCheck } from "lucide-react";
import "./SupplyReceive.css";
import api from "../../../apis/base";

const SupplyReceive = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSupplyOrder();
  }, [id]);

  const fetchSupplyOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/inventory/supply-orders/${id}/`);

      const order = response.data;

      if (order.status === "received" || order.status === "cancelled") {
        setError(`Cannot receive stock for a ${order.status} order.`);
        setData(order);
        return;
      }

      setData(order);

      const initialQuantities = {};

      order.items?.forEach((item) => {
        initialQuantities[item.id] = "";
      });

      setQuantities(initialQuantities);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to load supply order.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [itemId]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    let hasQuantity = false;

    data.items?.forEach((item) => {
      const value = quantities[item.id];

      if (value === "" || value === null || value === undefined) {
        return;
      }

      const quantity = Number(value);
      const remaining = Number(item.remaining_quantity);

      if (quantity <= 0) {
        newErrors[item.id] = "Receive quantity must be greater than 0.";
        return;
      }

      if (quantity > remaining) {
        newErrors[item.id] = `Maximum ${remaining} can be received.`;
        return;
      }

      hasQuantity = true;
    });

    if (!hasQuantity) {
      setError("Enter receive quantity for at least one item.");
      return false;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const items = Object.entries(quantities)
        .filter(([, quantity]) => quantity !== "" && Number(quantity) > 0)
        .map(([itemId, quantity]) => ({
          item_id: Number(itemId),
          quantity: Number(quantity),
        }));

      await api.post(`/inventory/supply-orders/${id}/receive/`, {
        items,
      });

      navigate(`/supply/details/${id}`);
    } catch (err) {
      console.error(err);

      const responseData = err.response?.data;

      if (responseData?.detail) {
        setError(responseData.detail);
      } else if (responseData?.error) {
        setError(responseData.error);
      } else if (typeof responseData === "string") {
        setError(responseData);
      } else {
        setError("Failed to receive stock.");
      }
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="item-page">
        <div className="details-message">Loading supply order...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="item-page">
        <div className="details-message">Supply order not found.</div>
      </div>
    );
  }

  return (
    <div className="item-page">
      {/* Header */}

      <div className="page-header">
        <div>
          <h1>Receive Supply</h1>
          <p>
            Receive stock against supply order{" "}
            <strong>{data.order_number}</strong>
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => navigate(`/supply/details/${id}`)}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Order Information */}

      <div className="details-card">
        <div className="details-card-header">
          <div>
            <h3>Order Information</h3>
            <span>Review the supply order before receiving stock</span>
          </div>

          <span className={`status ${getStatusClass(data.status)}`}>
            <span className="status-dot"></span>

            {getStatusLabel(data.status)}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <label>Order Number</label>

            <strong>{data.order_number}</strong>
          </div>

          <div className="detail-item">
            <label>Supplier</label>

            <strong>{data.supplier_identity || "-"}</strong>
          </div>

          <div className="detail-item">
            <label>Order Date</label>

            <strong>{data.order_date || "-"}</strong>
          </div>
        </div>
      </div>

      {/* Receive Form */}

      <form onSubmit={handleSubmit}>
        <div className="details-card">
          <div className="details-card-header">
            <div>
              <h3>Receive Items</h3>

              <span>Enter the quantity received for each item</span>
            </div>
          </div>

          {error && (
            <div className="form-error" style={{ color: "red" }}>
              {error}
            </div>
          )}

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
                  <th>Receive Qty</th>
                </tr>
              </thead>

              <tbody>
                {data.items?.map((item, index) => {
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

                  const remaining = Number(item.remaining_quantity);

                  return (
                    <tr key={item.id}>
                      <td className="td-number">{index + 1}</td>

                      <td>
                        <span className="material-type">{materialType}</span>
                      </td>

                      <td>
                        <strong className="identity">{material}</strong>
                      </td>

                      <td>{item.color_identity || "-"}</td>

                      <td>{item.unit_identity || "-"}</td>

                      <td className="quantity">{item.ordered_quantity}</td>
                      <td className="quantity">{item.received_quantity}</td>
                      <td className="quantity">{item.remaining_quantity}</td>

                      <td>
                        {remaining > 0 ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              max={remaining}
                              step="0.01"
                              value={quantities[item.id] ?? ""}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              className={
                                errors[item.id]
                                  ? "quantity-input input-error"
                                  : "quantity-input"
                              }
                              placeholder="0"
                            />

                            {errors[item.id] && (
                              <small
                                style={{
                                  color: "red",
                                }}
                                className="field-error"
                              >
                                {errors[item.id]}
                              </small>
                            )}
                          </>
                        ) : (
                          <span className="fully-received">Fully Received</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}

          <div className="receive-footer">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate(`/supply/details/${id}`)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={
                submitting ||
                data.status === "received" ||
                data.status === "cancelled"
              }
            >
              <PackageCheck size={17} />

              {submitting ? "Receiving..." : "Receive Stock"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupplyReceive;
