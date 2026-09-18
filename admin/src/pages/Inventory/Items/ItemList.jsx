
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination";
import "./ItemList.css"
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

            const response = await axios.get(
                "/items/",
                { params }
            );

            setItems(response.data.results || []);

            const count = response.data.count || 0;
            const pageSize = response.data.results?.length || 10;

            setTotalPages(
                Math.ceil(count / pageSize) || 1
            );

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

        const [
            fabricResponse,
            accessoryResponse,
            colorResponse,
            unitResponse,
        ] = await Promise.all([
            axios.get(
                "http://127.0.0.1:8000/master/fabrics/",
                {
                    params: {
                        is_active: true,
                    },
                    headers,
                }
            ),

            axios.get(
                "http://127.0.0.1:8000/master/accessory/",
                {params: {
                        is_active: true,
                    },
                    headers,
                }
            ),

            axios.get(
                "http://127.0.0.1:8000/master/colors/",
                {params: {
                        is_active: true,
                    },
                    headers,
                }
            ),

            axios.get(
                "http://127.0.0.1:8000/master/units/",
                {params: {
                        is_active: true,
                    },
                    headers,
                }
            ),
        ]);

        setMasterData({
            fabrics:
                fabricResponse.data.results ||
                fabricResponse.data,

            accessories:
                accessoryResponse.data.results ||
                accessoryResponse.data,

            colors:
                colorResponse.data.results ||
                colorResponse.data,

            units:
                unitResponse.data.results ||
                unitResponse.data,
        });

    } catch (error) {
        console.error(
            "Failed to fetch master data:",
            error
        );
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
                    <p>
                        Manage fabrics, accessories and their stock items.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={() => navigate("/items/add")}
                >
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

                    <button
                        className="clear-btn"
                        onClick={clearFilters}
                    >
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
                                <option
                                    key={fabric.id}
                                    value={fabric.id}
                                >
                                    {fabric.name}
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
                                <option
                                    key={accessory.id}
                                    value={accessory.id}
                                >
                                    {accessory.name}
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
                                <option
                                    key={color.id}
                                    value={color.id}
                                >
                                    {color.name}
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
                                <option
                                    key={unit.id}
                                    value={unit.id}
                                >
                                    {unit.name}
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

                <div className="table-header">
                    <div>
                        <h3>Items</h3>
                        <span>
                            {items.length} items shown
                        </span>
                    </div>
                </div>

                <div className="table-wrapper">

                    <table>

                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Fabric</th>
                                <th>Accessory</th>
                                <th>Color</th>
                                <th>Unit</th>
                                <th>Current Stock</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="8"
                                        className="table-message"
                                    >
                                        Loading...
                                    </td>
                                </tr>

                            ) : items.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="8"
                                        className="table-message"
                                    >
                                        No inventory items found.
                                    </td>
                                </tr>

                            ) : (

                                items.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                                            <strong>
                                                {item.code}
                                            </strong>
                                        </td>

                                        <td>
                                            {item.fabric || "-"}
                                        </td>

                                        <td>
                                            {item.accessory || "-"}
                                        </td>

                                        <td>
                                            {item.color || "-"}
                                        </td>

                                        <td>
                                            {item.unit || "-"}
                                        </td>

                                        <td>
                                            {item.current_stock ?? 0}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    item.is_active
                                                        ? "status active"
                                                        : "status inactive"
                                                }
                                            >
                                                {item.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="action-buttons">

                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/items/details/${item.id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/items/add/${item.id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))
                            )}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}
                {!loading && items.length > 0 && (
                    <div className="pagination-container">

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
