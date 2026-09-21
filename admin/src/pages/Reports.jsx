import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  BarChart3,
  Search,
  Package,
  ShoppingCart,
  Factory,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  X,
  Download,
} from "lucide-react";
import api from "../apis/base";

const Reports = () => {
  const [activeReport, setActiveReport] = useState("inventory");

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [lowStock, setLowStock] = useState(false);

  const [summary, setSummary] = useState({});
  const [data, setData] = useState([]);

  const fetchReport = async () => {
    try {
      setLoading(true);

      let endpoint = "";

      if (activeReport === "inventory") {
        endpoint = "auth/report/inventory/";
      } else if (activeReport === "supply") {
        endpoint = "auth/report/supply-orders/";
      } else {
        endpoint = "auth/report/production/";
      }

      const params = {};

      if (search) {
        params.search = search;
      }

      if (activeReport === "inventory") {
        if (materialType) {
          params.material_type = materialType;
        }

        if (lowStock) {
          params.low_stock = "true";
        }
      }

      if (activeReport === "supply" || activeReport === "production") {
        if (status) {
          params.status = status;
        }
      }

      const response = await api.get(endpoint, {
        params,
      });

      setSummary(response.data.summary || {});
      setData(response.data.results || []);
    } catch (error) {
      console.error("Error fetching report:", error);

      setSummary({});
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [activeReport, search, status, materialType, lowStock]);

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setMaterialType("");
    setLowStock(false);
  };
  const downloadExcel = () => {
    if (!data.length) {
      return;
    }

    let exportData = [];

    if (activeReport === "inventory") {
      exportData = data.map((item, index) => ({
        "#": index + 1,
        Material: item.material_name,
        Type: item.material_type,
        Color: item.color,
        Unit: item.unit,
        Quantity: item.quantity,
        Status: item.stock_status,
      }));
    } else if (activeReport === "supply") {
      exportData = data.map((item, index) => ({
        "#": index + 1,
        "Order No": item.order_number,
        Supplier: item.supplier,
        "Order Date": item.order_date || "-",
        Ordered: item.ordered_quantity,
        Received: item.received_quantity,
        Pending: item.pending_quantity,
        Status: getStatusLabel(item.status),
      }));
    } else {
      exportData = data.map((item, index) => ({
        "#": index + 1,
        "Production No": item.production_no,
        Product: item.product,
        BOM: item.bom_number,
        Quantity: item.quantity,
        "Production Line": item.production_line || "-",
        Status: item.status_display || getStatusLabel(item.status),
        Created: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "-",
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      activeReport === "inventory"
        ? "Inventory"
        : activeReport === "supply"
          ? "Supply Orders"
          : "Production",
    );

    const fileName =
      activeReport === "inventory"
        ? "inventory_report.xlsx"
        : activeReport === "supply"
          ? "supply_orders_report.xlsx"
          : "production_report.xlsx";

    XLSX.writeFile(workbook, fileName);
  };

  const getStatusStyle = (status) => {
    const styles = {
      ordered: {
        backgroundColor: "#fff7ed",
        color: "#c2410c",
        dot: "#f97316",
      },
      partial: {
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        dot: "#3b82f6",
      },
      received: {
        backgroundColor: "#ecfdf3",
        color: "#15803d",
        dot: "#22c55e",
      },
      WAITING: {
        backgroundColor: "#fff7ed",
        color: "#c2410c",
        dot: "#f97316",
      },
      CUTTING: {
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        dot: "#3b82f6",
      },
      STITCHING: {
        backgroundColor: "#f5f3ff",
        color: "#7c3aed",
        dot: "#8b5cf6",
      },
      SEWING: {
        backgroundColor: "#eef2ff",
        color: "#4338ca",
        dot: "#6366f1",
      },
      FINISHING: {
        backgroundColor: "#f0fdfa",
        color: "#0f766e",
        dot: "#14b8a6",
      },
      COMPLETED: {
        backgroundColor: "#ecfdf3",
        color: "#15803d",
        dot: "#22c55e",
      },
      CANCELLED: {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
        dot: "#ef4444",
      },
    };

    return (
      styles[status] || {
        backgroundColor: "#f8fafc",
        color: "#64748b",
        dot: "#94a3b8",
      }
    );
  };

  const getStatusLabel = (status) => {
    const labels = {
      ordered: "Ordered",
      partial: "Partial",
      received: "Received",
      WAITING: "Waiting",
      CUTTING: "Cutting",
      STITCHING: "Stitching",
      SEWING: "Sewing",
      FINISHING: "Finishing",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    };

    return labels[status] || status || "-";
  };

  const renderSummaryCards = () => {
    if (activeReport === "inventory") {
      return (
        <>
          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                backgroundColor: "#eef2ff",
                color: "#4f46e5",
              }}
            >
              <Package size={20} />
            </div>

            <div>
              <p style={styles.summaryLabel}>Total Items</p>
              <h3 style={styles.summaryValue}>{summary.total_items || 0}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                backgroundColor: "#ecfdf3",
                color: "#15803d",
              }}
            >
              <BarChart3 size={20} />
            </div>

            <div>
              <p style={styles.summaryLabel}>Total Quantity</p>
              <h3 style={styles.summaryValue}>{summary.total_quantity || 0}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                backgroundColor: "#fef2f2",
                color: "#dc2626",
              }}
            >
              <AlertTriangle size={20} />
            </div>

            <div>
              <p style={styles.summaryLabel}>Low Stock</p>
              <h3 style={styles.summaryValue}>
                {summary.low_stock_items || 0}
              </h3>
            </div>
          </div>
        </>
      );
    }

    if (activeReport === "supply") {
      return (
        <>
          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                backgroundColor: "#eef2ff",
                color: "#4f46e5",
              }}
            >
              <ShoppingCart size={20} />
            </div>

            <div>
              <p style={styles.summaryLabel}>Total Orders</p>
              <h3 style={styles.summaryValue}>{summary.total_orders || 0}</h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                backgroundColor: "#eff6ff",
                color: "#2563eb",
              }}
            >
              <Package size={20} />
            </div>

            <div>
              <p style={styles.summaryLabel}>Ordered Quantity</p>
              <h3 style={styles.summaryValue}>
                {summary.ordered_quantity || 0}
              </h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                backgroundColor: "#ecfdf3",
                color: "#15803d",
              }}
            >
              <CheckCircle2 size={20} />
            </div>

            <div>
              <p style={styles.summaryLabel}>Received Quantity</p>
              <h3 style={styles.summaryValue}>
                {summary.received_quantity || 0}
              </h3>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                backgroundColor: "#fff7ed",
                color: "#c2410c",
              }}
            >
              <Clock3 size={20} />
            </div>

            <div>
              <p style={styles.summaryLabel}>Pending Quantity</p>
              <h3 style={styles.summaryValue}>
                {summary.pending_quantity || 0}
              </h3>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#eef2ff",
              color: "#4f46e5",
            }}
          >
            <Factory size={20} />
          </div>

          <div>
            <p style={styles.summaryLabel}>Total Orders</p>
            <h3 style={styles.summaryValue}>{summary.total_orders || 0}</h3>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#ecfdf3",
              color: "#15803d",
            }}
          >
            <Package size={20} />
          </div>

          <div>
            <p style={styles.summaryLabel}>Total Quantity</p>
            <h3 style={styles.summaryValue}>{summary.total_quantity || 0}</h3>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#fff7ed",
              color: "#c2410c",
            }}
          >
            <Clock3 size={20} />
          </div>

          <div>
            <p style={styles.summaryLabel}>Waiting</p>
            <h3 style={styles.summaryValue}>{summary.status?.WAITING || 0}</h3>
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div
            style={{
              ...styles.summaryIcon,
              backgroundColor: "#ecfdf3",
              color: "#15803d",
            }}
          >
            <CheckCircle2 size={20} />
          </div>

          <div>
            <p style={styles.summaryLabel}>Completed</p>
            <h3 style={styles.summaryValue}>
              {summary.status?.COMPLETED || 0}
            </h3>
          </div>
        </div>
      </>
    );
  };

  const renderInventoryTable = () => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>Material</th>
          <th style={styles.th}>Type</th>
          <th style={styles.th}>Color</th>
          <th style={styles.th}>Unit</th>
          <th style={styles.th}>Quantity</th>
          <th style={styles.th}>Status</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => (
          <tr key={item.id}>
            <td style={styles.td}>{index + 1}</td>

            <td
              style={{
                ...styles.td,
                ...styles.identity,
              }}
            >
              {item.material_name}
            </td>

            <td style={styles.td}>{item.material_type}</td>

            <td style={styles.td}>{item.color}</td>

            <td style={styles.td}>{item.unit}</td>

            <td style={styles.td}>{item.quantity}</td>

            <td style={styles.td}>
              <span
                style={{
                  ...styles.status,
                  ...(item.stock_status === "Low Stock"
                    ? styles.lowStock
                    : styles.available),
                }}
              >
                <span
                  style={{
                    ...styles.statusDot,
                    backgroundColor:
                      item.stock_status === "Low Stock" ? "#ef4444" : "#22c55e",
                  }}
                />
                {item.stock_status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderSupplyTable = () => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>Order No</th>
          <th style={styles.th}>Supplier</th>
          <th style={styles.th}>Order Date</th>
          <th style={styles.th}>Ordered</th>
          <th style={styles.th}>Received</th>
          <th style={styles.th}>Pending</th>
          <th style={styles.th}>Status</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => {
          const statusStyle = getStatusStyle(item.status);

          return (
            <tr key={item.id}>
              <td style={styles.td}>{index + 1}</td>

              <td
                style={{
                  ...styles.td,
                  ...styles.identity,
                }}
              >
                {item.order_number}
              </td>

              <td style={styles.td}>{item.supplier}</td>

              <td style={styles.td}>{item.order_date || "-"}</td>

              <td style={styles.td}>{item.ordered_quantity}</td>

              <td style={styles.td}>{item.received_quantity}</td>

              <td style={styles.td}>{item.pending_quantity}</td>

              <td style={styles.td}>
                <span
                  style={{
                    ...styles.status,
                    backgroundColor: statusStyle.backgroundColor,
                    color: statusStyle.color,
                  }}
                >
                  <span
                    style={{
                      ...styles.statusDot,
                      backgroundColor: statusStyle.dot,
                    }}
                  />
                  {getStatusLabel(item.status)}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderProductionTable = () => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>Production No</th>
          <th style={styles.th}>Product</th>
          <th style={styles.th}>BOM</th>
          <th style={styles.th}>Quantity</th>
          <th style={styles.th}>Production Line</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Created</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => {
          const statusStyle = getStatusStyle(item.status);

          return (
            <tr key={item.id}>
              <td style={styles.td}>{index + 1}</td>

              <td
                style={{
                  ...styles.td,
                  ...styles.identity,
                }}
              >
                {item.production_no}
              </td>

              <td style={styles.td}>{item.product}</td>

              <td style={styles.td}>{item.bom_number}</td>

              <td style={styles.td}>{item.quantity}</td>

              <td style={styles.td}>{item.production_line || "-"}</td>

              <td style={styles.td}>
                <span
                  style={{
                    ...styles.status,
                    backgroundColor: statusStyle.backgroundColor,
                    color: statusStyle.color,
                  }}
                >
                  <span
                    style={{
                      ...styles.statusDot,
                      backgroundColor: statusStyle.dot,
                    }}
                  />

                  {item.status_display || getStatusLabel(item.status)}
                </span>
              </td>

              <td style={styles.td}>
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderTable = () => {
    if (loading) {
      return <div style={styles.empty}>Loading report...</div>;
    }

    if (data.length === 0) {
      return <div style={styles.empty}>No report data found</div>;
    }

    if (activeReport === "inventory") {
      return renderInventoryTable();
    }

    if (activeReport === "supply") {
      return renderSupplyTable();
    }

    return renderProductionTable();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Reports</h2>

          <p style={styles.subtitle}>
            View inventory, supply order and production reports
          </p>
        </div>
      </div>

      <div style={styles.reportTabs}>
        <button
          type="button"
          onClick={() => {
            setActiveReport("inventory");
            clearFilters();
          }}
          style={{
            ...styles.reportTab,
            ...(activeReport === "inventory" ? styles.activeReportTab : {}),
          }}
        >
          <Package size={17} />
          Inventory
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveReport("supply");
            clearFilters();
          }}
          style={{
            ...styles.reportTab,
            ...(activeReport === "supply" ? styles.activeReportTab : {}),
          }}
        >
          <ShoppingCart size={17} />
          Supply Orders
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveReport("production");
            clearFilters();
          }}
          style={{
            ...styles.reportTab,
            ...(activeReport === "production" ? styles.activeReportTab : {}),
          }}
        >
          <Factory size={17} />
          Production
        </button>
      </div>

      <div style={styles.summaryGrid}>{renderSummaryCards()}</div>

      <div style={styles.filterCard}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Search</label>

          <div style={styles.searchWrapper}>
            <Search size={17} style={styles.searchIcon} />

            <input
              type="text"
              placeholder={
                activeReport === "inventory"
                  ? "Search material..."
                  : activeReport === "supply"
                    ? "Search order or supplier..."
                    : "Search production..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {activeReport === "inventory" && (
          <>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Material Type</label>

              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                style={styles.select}
              >
                <option value="">All Materials</option>
                <option value="fabric">Fabric</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={lowStock}
                onChange={(e) => setLowStock(e.target.checked)}
              />
              Low Stock
            </label>
          </>
        )}

        {activeReport !== "inventory" && (
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>

            {activeReport === "supply" ? (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.select}
              >
                <option value="">All Status</option>
                <option value="ordered">Ordered</option>
                <option value="partial">Partial</option>
                <option value="received">Received</option>
              </select>
            ) : (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.select}
              >
                <option value="">All Status</option>
                <option value="WAITING">Waiting</option>
                <option value="CUTTING">Cutting</option>
                <option value="STITCHING">Stitching</option>
                <option value="SEWING">Sewing</option>
                <option value="FINISHING">Finishing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            )}
          </div>
        )}

        <button type="button" onClick={clearFilters} style={styles.clearButton}>
          <X size={16} />
          Clear
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.tableHeader}>
          <div>
            <h3 style={styles.tableTitle}>
              {activeReport === "inventory"
                ? "Inventory Report"
                : activeReport === "supply"
                  ? "Supply Order Report"
                  : "Production Report"}
            </h3>

            <p style={styles.tableSubtitle}>{data.length} results</p>
          </div>

          <button
            type="button"
            onClick={downloadExcel}
            disabled={!data.length}
            style={{
              ...styles.downloadButton,
              opacity: data.length ? 1 : 0.5,
              cursor: data.length ? "pointer" : "not-allowed",
            }}
          >
            <Download size={16} />
            Download Excel
          </button>
        </div>

        <div style={styles.tableWrapper}>{renderTable()}</div>
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

  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "650",
    color: "#0f172a",
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: "14px",
    color: "#64748b",
  },

  reportTabs: {
    display: "flex",
    gap: "8px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "6px",
    marginBottom: "20px",
    width: "fit-content",
  },

  reportTab: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    height: "38px",
    padding: "0 14px",
    border: "none",
    borderRadius: "7px",
    backgroundColor: "transparent",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },

  activeReportTab: {
    backgroundColor: "#eef2ff",
    color: "#4f46e5",
    fontWeight: "600",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "14px",
    marginBottom: "20px",
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "17px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
  },

  summaryIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  summaryLabel: {
    margin: 0,
    fontSize: "12px",
    color: "#64748b",
  },

  summaryValue: {
    margin: "4px 0 0",
    fontSize: "20px",
    fontWeight: "650",
    color: "#0f172a",
  },

  filterCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "20px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
    flexWrap: "wrap",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  filterLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },

  searchWrapper: {
    position: "relative",
    width: "320px",
  },

  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    pointerEvents: "none",
  },

  searchInput: {
    width: "320px",
    height: "40px",
    boxSizing: "border-box",
    padding: "10px 12px 10px 38px",
    border: "1px solid #dbe1ea",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
  },

  select: {
    width: "170px",
    height: "40px",
    padding: "0 12px",
    border: "1px solid #dbe1ea",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    color: "#475569",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },

  checkboxLabel: {
    height: "40px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
    color: "#475569",
    cursor: "pointer",
  },

  clearButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    height: "40px",
    padding: "0 14px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
  },

  tableHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px",
    borderBottom: "1px solid #e2e8f0",
  },

  tableTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
  },

  tableSubtitle: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },
  downloadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    height: "38px",
    padding: "0 14px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "13px 18px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "15px 18px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap",
  },

  identity: {
    fontWeight: "500",
    color: "#0f172a",
  },

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },

  lowStock: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },

  available: {
    backgroundColor: "#ecfdf3",
    color: "#15803d",
  },

  empty: {
    padding: "60px 20px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
  },
};

export default Reports;
