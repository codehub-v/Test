import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import { Eye, Pencil } from "lucide-react";
import "./ItemList.css";
const ItemList = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    fabric: "",
    accessory: "",
    color: "",
    unit: "",
    is_active: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [masterData, setMasterData] = useState({
    fabrics: [],
    accessories: [],
    colors: [],
    units: [],
  });

  const fetchItems = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
      };

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "") {
          params[key] = filters[key];
        }
      });
      const headers = {
        Authorization: `Token ${localStorage.getItem("token")}`,
      };

      const response = await axios.get(
        "http://127.0.0.1:8000/inventory/items/",
        {
          params,
          headers,
        },
      );
      setItems(response.data.results || []);

      const count = response.data.count || 0;
      const pageSize = response.data.results?.length || 10;

      setTotalPages(Math.ceil(count / pageSize) || 1);
    } catch (error) {
      console.error("Failed to fetch inventory items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const headers = {
        Authorization: `Token ${localStorage.getItem("token")}`,
      };

      const [fabricResponse, accessoryResponse, colorResponse, unitResponse] =
        await Promise.all([
          axios.get("http://127.0.0.1:8000/master/meta/fabrics/", {
            headers,
          }),

          axios.get("http://127.0.0.1:8000/master/meta/accessories/", {
            headers,
          }),

          axios.get("http://127.0.0.1:8000/master/meta/colors/", {
            headers,
          }),

          axios.get("http://127.0.0.1:8000/master/meta/units/", {
            headers,
          }),
        ]);
      console.log(fabricResponse.data, colorResponse.data);

      setMasterData({
        fabrics: fabricResponse.data.results || fabricResponse.data,

        accessories: accessoryResponse.data.results || accessoryResponse.data,

        colors: colorResponse.data.results || colorResponse.data,

        units: unitResponse.data.results || unitResponse.data,
      });
    } catch (error) {
      console.error("Failed to fetch master data:", error);
    }
  };
  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      fabric: "",
      accessory: "",
      color: "",
      unit: "",
      is_active: "",
    });

    setCurrentPage(1);
  };

  return (
    <div className="item-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Inventory Items</h1>
          <p>Manage fabrics, accessories and their stock items.</p>
        </div>

        <button className="primary-btn" onClick={() => navigate("/items/add")}>
          + Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="filter-card">
        <div className="filter-header">
          <div>
            <h3>Filters</h3>
            <span>Search and filter inventory items</span>
          </div>

          <button className="clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        <div className="filter-grid">
          {/* Search */}
          <div className="form-group search-group">
            <label>Search</label>

            <input
              type="text"
              name="search"
              placeholder="Search item..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          {/* Fabric */}
          <div className="form-group">
            <label>Fabric</label>

            <select
              name="fabric"
              value={filters.fabric}
              onChange={handleFilterChange}
            >
              <option value="">All Fabrics</option>

              {masterData.fabrics.map((fabric) => (
                <option key={fabric.id} value={fabric.id}>
                  {fabric.identity}
                </option>
              ))}
            </select>
          </div>

          {/* Accessory */}
          <div className="form-group">
            <label>Accessory</label>

            <select
              name="accessory"
              value={filters.accessory}
              onChange={handleFilterChange}
            >
              <option value="">All Accessories</option>

              {masterData.accessories.map((accessory) => (
                <option key={accessory.id} value={accessory.id}>
                  {accessory.identity}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="form-group">
            <label>Color</label>

            <select
              name="color"
              value={filters.color}
              onChange={handleFilterChange}
            >
              <option value="">All Colors</option>

              {masterData.colors.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.identity}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="form-group">
            <label>Unit</label>

            <select
              name="unit"
              value={filters.unit}
              onChange={handleFilterChange}
            >
              <option value="">All Units</option>

              {masterData.units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.identity}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>

            <select
              name="is_active"
              value={filters.is_active}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                {/* <th>Code</th> */}
                <th>Fabric</th>
                <th>Accessory</th>
                <th>Color</th>
                <th>Unit</th>
                <th>Current Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="table-message">
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="9" className="table-message">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.uuid || item.id}>
                    <td className="td-number">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>

                    {/* <td>
                      <span className="identity">{item.code}</span>
                    </td> */}

                    <td>{item.fabric || "-"}</td>

                    <td>{item.accessory || "-"}</td>

                    <td>{item.color || "-"}</td>

                    <td>{item.unit || "-"}</td>

                    <td>{item.quantity ?? 0}</td>

                    <td>
                      <span
                        className={`status ${
                          item.is_active ? "active" : "inactive"
                        }`}
                      >
                        <span className="status-dot" />
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="action-button view-button"
                          onClick={() => navigate(`/items/details/${item.id}`)}
                          title="View Item"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="action-button edit-button"
                          onClick={() => navigate(`/items/add/${item.id}`)}
                          title="Edit Item"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && items.length > 0 && (
          <div className="table-footer">
            <span className="result-text">{items.length} results</span>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
