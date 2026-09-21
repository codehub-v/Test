import React, { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

import { getColors, createColor, updateColor } from "../../../apis/masterApi";

import ColorModal from "./ColorModal";
import Pagination from "../../../components/Pagination";

const ColorList = () => {
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState(null);

  const fetchColors = async () => {
    try {
      const params = {
        page: currentPage,
      };

      if (search) {
        params.search = search;
      }

      if (status) {
        params.is_active = status;
      }

      const response = await getColors(params);

      setData(response.data.results || []);

      setTotalPages(Math.ceil((response.data.count || 0) / 10));
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  useEffect(() => {
    fetchColors();
  }, [currentPage, search, status]);

  const handleSubmit = async (formData) => {
    if (editingColor) {
      const response = await updateColor(editingColor.id, formData);

      await fetchColors();

      return response.data;
    }

    const response = await createColor(formData);

    await fetchColors();

    return response.data;
  };

  const handleClear = () => {
    setSearch("");
    setStatus("");
    setCurrentPage(1);
  };

  // OPEN ADD MODAL

  const handleAdd = () => {
    setEditingColor(null);
    setShowModal(true);
  };

  // OPEN EDIT MODAL

  const handleEdit = (color) => {
    setEditingColor(color);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingColor(null);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <h2 style={styles.title}>Colors</h2>

          <p style={styles.subtitle}>Manage color master data</p>
        </div>

        <button onClick={handleAdd} style={styles.addButton}>
          <Plus size={18} />
          Add Color
        </button>
      </div>

      <div style={styles.filterCard}>
        {/* Search */}

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Search</label>

          <div style={styles.searchWrapper}>
            <Search size={17} style={styles.searchIcon} />

            <input
              type="text"
              placeholder="Search colors..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Status */}

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status</label>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.select}
          >
            <option value="">All Status</option>

            <option value="true">Active</option>

            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Clear */}

        <button type="button" onClick={handleClear} style={styles.clearButton}>
          <X size={16} />
          Clear
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>

                <th style={styles.th}>Code</th>

                <th style={styles.th}>Color</th>

                <th style={styles.th}>Status</th>

                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={styles.empty}>
                    No colors found
                  </td>
                </tr>
              ) : (
                data.map((color, index) => (
                  <tr key={color.id}>
                    {/* Number */}

                    <td
                      style={{
                        ...styles.td,
                        color: "#94a3b8",
                      }}
                    >
                      {(currentPage - 1) * 10 + index + 1}
                    </td>

                    {/* Code */}

                    <td
                      style={{
                        ...styles.td,
                        ...styles.code,
                      }}
                    >
                      {color.code}
                    </td>

                    {/* Color */}

                    <td
                      style={{
                        ...styles.td,
                        ...styles.identity,
                      }}
                    >
                      {color.identity}
                    </td>

                    {/* Status */}

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,

                          ...(color.is_active
                            ? styles.active
                            : styles.inactive),
                        }}
                      >
                        <span
                          style={{
                            ...styles.statusDot,

                            ...(color.is_active
                              ? styles.activeDot
                              : styles.inactiveDot),
                          }}
                        />

                        {color.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}

                    <td style={styles.td}>
                      <div style={styles.actions}>
                        {/* Edit */}

                        <button
                          onClick={() => handleEdit(color)}
                          style={{
                            ...styles.actionButton,
                            ...styles.editButton,
                          }}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        {/* Delete 

                                                    <button
                                                        style={{
                                                            ...styles.actionButton,
                                                            ...styles.deleteButton,
                                                        }}
                                                        title="Delete"
                                                    >
                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>*/}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.footer}>
          <span style={styles.resultText}>{data.length} results</span>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages > 0 ? totalPages : 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ColorModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingColor={editingColor}
      />
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

  /* Filter */

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
    width: "160px",
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

  /* Add */

  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },

  /* Card */

  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
    overflow: "hidden",
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

  code: {
    fontFamily: "monospace",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },

  identity: {
    fontWeight: "500",
    color: "#0f172a",
  },

  /* Status */

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },

  active: {
    backgroundColor: "#ecfdf3",
    color: "#15803d",
  },

  activeDot: {
    backgroundColor: "#22c55e",
  },

  inactive: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },

  inactiveDot: {
    backgroundColor: "#ef4444",
  },

  /* Actions */

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  actionButton: {
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
    borderRadius: "7px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },

  editButton: {
    color: "#4f46e5",
  },

  deleteButton: {
    color: "#dc2626",
  },

  /* Footer */

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
  },

  resultText: {
    fontSize: "13px",
    color: "#64748b",
  },

  empty: {
    padding: "50px 20px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "14px",
  },
};

export default ColorList;
