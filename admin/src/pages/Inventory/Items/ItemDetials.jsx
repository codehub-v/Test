import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Package,
  Layers,
  Palette,
  Ruler,
  Activity,
} from "lucide-react";
import "./ItemDetails.css";

const ItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const headers = {
    Authorization: `Token ${localStorage.getItem("token")}`,
  };

  const fetchItem = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `http://127.0.0.1:8000/inventory/items/${id}/`,
        { headers },
      );

      setItem(response.data);
    } catch (error) {
      console.error("Failed to fetch inventory item:", error);

      setErrorMessage(
        "Unable to load inventory item details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="item-details-page">
        <div className="details-loading">Loading inventory item...</div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="item-details-page">
        <div className="details-error">
          <Activity size={20} />

          <span>{errorMessage}</span>
        </div>

        <button className="back-button" onClick={() => navigate("/items")}>
          <ArrowLeft size={18} />
          Back to Items
        </button>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  /* =========================
       Item Type
    ========================= */

  const isFabric = Boolean(item.fabric_details);

  const isAccessory = Boolean(item.accessory_details);

  const itemType = isFabric ? "Fabric" : isAccessory ? "Accessory" : "-";

  const materialDetails = isFabric
    ? item.fabric_details
    : isAccessory
      ? item.accessory_details
      : null;

  return (
    <div className="item-details-page">
      <div className="item-details-header">
        <div className="item-details-title-section">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/items")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h2>Inventory Item</h2>

            <p>View inventory item details</p>
          </div>
        </div>

        <button
          type="button"
          className="detail-edit-button"
          onClick={() => navigate(`/items/add/${id}`)}
        >
          <Edit size={17} />
          Edit
        </button>
      </div>

      <div className="details-card">
        <div className="details-card-header">
          <div className="item-code-wrapper">
            <div className="item-icon">
              <Package size={21} />
            </div>

            <div>
              <h3>{item.code}</h3>

              <span>Inventory Item</span>
            </div>
          </div>

          <span
            className={
              item.is_active ? "status-badge active" : "status-badge inactive"
            }
          >
            <span className="status-dot" />

            {item.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-icon">
              <Layers size={18} />
            </div>

            <div>
              <span className="detail-label">Item Type</span>

              <strong>{itemType}</strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Package size={18} />
            </div>

            <div>
              <span className="detail-label">
                {isFabric ? "Fabric" : "Accessory"}
              </span>

              <strong>{materialDetails?.identity || "-"}</strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Palette size={18} />
            </div>

            <div>
              <span className="detail-label">Color</span>

              <strong>{item.color_details?.identity || "-"}</strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <Ruler size={18} />
            </div>

            <div>
              <span className="detail-label">Unit</span>

              <strong>{item.unit_details?.identity || "-"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
