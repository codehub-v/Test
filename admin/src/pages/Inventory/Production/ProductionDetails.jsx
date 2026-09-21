import React, { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Factory, Package, CalendarDays } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../apis/base";
import "./ProductionDetails.css";

const ProductionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [production, setProduction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduction();
  }, [id]);

  const fetchProduction = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`inventory/order/${id}/`);
      setProduction(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to load production order."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      WAITING: "status-waiting",
      CUTTING: "status-cutting",
      STITCHING: "status-stitching",
      SEWING: "status-sewing",
      FINISHING: "status-finishing",
      COMPLETED: "status-completed",
      CANCELLED: "status-cancelled",
    };

    return statusClasses[status] || "status-default";
  };

  const getStatusLabel = (production) => {
    return production.status_display || production.status || "-";
  };

  if (loading) {
    return (
      <div className="production-details-page">
        <div className="production-details-loading">
          Loading production details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="production-details-page">
        <div className="production-details-header">
          <button
            className="back-button"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1>Production Details</h1>
            <p>View production order information</p>
          </div>
        </div>

        <div className="production-error">
          {error}
        </div>
      </div>
    );
  }

  if (!production) {
    return null;
  }

  return (
    <div className="production-details-page">
      <div className="production-details-header">
        <div className="production-header-left">
          <button
            className="back-button"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1>Production Details</h1>
            <p>View production order information</p>
          </div>
        </div>

        <button
          className="edit-button"
          onClick={() => navigate(`/orders/add/${production.id}`)}
        >
          <Pencil size={16} />
          Edit
        </button>
      </div>

      <div className="production-profile-card">
        <div className="production-profile-icon">
          <Factory size={25} />
        </div>

        <div className="production-profile-content">
          <div className="production-title-row">
            <h2>{production.production_no}</h2>

            <span
              className={`production-status ${getStatusClass(
                production.status
              )}`}
            >
              <span className="status-dot"></span>
              {getStatusLabel(production)}
            </span>
          </div>

          <p>Production Order</p>
        </div>
      </div>

      <div className="production-card">
        <div className="production-card-header">
          <div className="card-header-icon">
            <Package size={17} />
          </div>

          <div>
            <h3>Production Information</h3>
            <p>Basic production order details</p>
          </div>
        </div>

        <div className="production-info-grid">
          <div className="info-item">
            <span className="info-label">Production Number</span>
            <span className="info-value">
              {production.production_no || "-"}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Product</span>
            <span className="info-value">
              {production.product_details?.identity ||
                production.product_name ||
                "-"}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Quantity</span>
            <span className="info-value">
              {production.quantity ?? "-"}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Production Line</span>
            <span className="info-value">
              {production.production_line || "-"}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Status</span>
            <span className="info-value">
              {getStatusLabel(production)}
            </span>
          </div>
        </div>
      </div>

      <div className="production-card">
        <div className="production-card-header">
          <div className="card-header-icon">
            <CalendarDays size={17} />
          </div>

          <div>
            <h3>Production Timeline</h3>
            <p>Process stage dates</p>
          </div>
        </div>

        <div className="production-info-grid">
          <div className="info-item">
            <span className="info-label">Cutting Date</span>
            <span className="info-value">
              {formatDate(production.cutting_date)}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Stitching Date</span>
            <span className="info-value">
              {formatDate(production.stitching_date)}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Sewing Date</span>
            <span className="info-value">
              {formatDate(production.sewing_date)}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Finishing Date</span>
            <span className="info-value">
              {formatDate(production.finishing_date)}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Completed Date</span>
            <span className="info-value">
              {formatDate(production.completed_date)}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Cancelled Date</span>
            <span className="info-value">
              {formatDate(production.cancelled_date)}
            </span>
          </div>
        </div>
      </div>

      <div className="production-card">
        <div className="production-card-header">
          <div>
            <h3>Remarks</h3>
            <p>Additional production information</p>
          </div>
        </div>

        <div className="remarks-content">
          {production.remarks || "No remarks added."}
        </div>
      </div>

      <div className="production-card">
        <div className="production-info-grid">
          <div className="info-item">
            <span className="info-label">Created At</span>
            <span className="info-value">
              {formatDate(production.created_at)}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Last Updated</span>
            <span className="info-value">
              {formatDate(production.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDetails;