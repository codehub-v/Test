import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, PackageCheck } from "lucide-react";
import Pagination from "../../../components/Pagination";
import "./SupplyList.css";
import api from "../../../apis/base";

const SupplyList = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        supplier: "",
        order_date_from: "",
        order_date_to: "",
    });

    // =========================
    // Fetch Suppliers
    // =========================

    const fetchSuppliers = async () => {
        try {
            const response = await api.get(
                "/master/meta/suppliers/"
            );

            setSuppliers(
                response.data || []
            );
        } catch (error) {
            console.error(
                "Failed to fetch suppliers:",
                error
            );
        }
    };

    // =========================
    // Fetch Supply Orders
    // =========================

    const fetchSupplyOrders = async () => {
        try {
            setLoading(true);

            const params = {
                page: currentPage,
            };

            Object.entries(filters).forEach(
                ([key, value]) => {
                    if (value) {
                        params[key] = value;
                    }
                }
            );

            const response = await api.get(
                "/inventory/supply-orders/",
                { params }
            );

            setData(
                response.data.results || []
            );

            if (response.data.count) {
                const pageSize =
                    response.data.results?.length || 10;

                setTotalPages(
                    Math.ceil(
                        response.data.count / pageSize
                    )
                );
            } else {
                setTotalPages(1);
            }

        } catch (error) {
            console.error(
                "Failed to fetch supply orders:",
                error
            );

            setData([]);
            setTotalPages(1);

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Effects
    // =========================

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        fetchSupplyOrders();
    }, [currentPage, filters]);

    // =========================
    // Filter Change
    // =========================

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));

        setCurrentPage(1);
    };

    // =========================
    // Clear Filters
    // =========================

    const clearFilters = () => {
        setFilters({
            search: "",
            status: "",
            supplier: "",
            order_date_from: "",
            order_date_to: "",
        });

        setCurrentPage(1);
    };

    // =========================
    // Helpers
    // =========================

    const formatDate = (date) => {
        if (!date) return "-";

        const [year, month, day] =
            date.split("-");

        return `${day}-${month}-${year}`;
    };

    const getStatusLabel = (status) => {
        const labels = {
            ordered: "Ordered",
            partial: "Partially Received",
            received: "Received",
            cancelled: "Cancelled",
        };

        return labels[status] || status || "-";
    };

    // =========================
    // Render
    // =========================

    return (
        <div className="item-page">

            {/* Header */}

            <div className="page-header">

                <div>
                    <h1>Supply Orders</h1>

                    <p>
                        Manage supplier orders and stock receipts.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={() =>
                        navigate("/supply/add")
                    }
                >
                    + Add Supply Order
                </button>

            </div>


            {/* Filters */}

            <div className="filter-card">

                <div className="filter-header">

                    <div>
                        <h3>Filters</h3>

                        <span>
                            Search and filter supply orders
                        </span>
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

                    <div className="form-group">

                        <label>
                            Search
                        </label>

                        <input
                            type="text"
                            name="search"
                            placeholder="Search order or supplier..."
                            value={filters.search}
                            onChange={
                                handleFilterChange
                            }
                        />

                    </div>


                    {/* Status */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={filters.status}
                            onChange={
                                handleFilterChange
                            }
                        >

                            <option value="">
                                All Status
                            </option>

                            <option value="ordered">
                                Ordered
                            </option>

                            <option value="partial">
                                Partially Received
                            </option>

                            <option value="received">
                                Received
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>


                    {/* Supplier */}

                    <div className="form-group">

                        <label>
                            Supplier
                        </label>

                        <select
                            name="supplier"
                            value={filters.supplier}
                            onChange={
                                handleFilterChange
                            }
                        >

                            <option value="">
                                All Suppliers
                            </option>

                            {suppliers.map(
                                (supplier) => (
                                    <option
                                        key={supplier.id}
                                        value={supplier.id}
                                    >
                                        {supplier.identity}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* Order Date From */}

                    <div className="form-group">

                        <label>
                            Order Date From
                        </label>

                        <input
                            type="date"
                            name="order_date_from"
                            value={
                                filters.order_date_from
                            }
                            onChange={
                                handleFilterChange
                            }
                        />

                    </div>


                    {/* Order Date To */}

                    <div className="form-group">

                        <label>
                            Order Date To
                        </label>

                        <input
                            type="date"
                            name="order_date_to"
                            value={
                                filters.order_date_to
                            }
                            onChange={
                                handleFilterChange
                            }
                        />

                    </div>

                </div>

            </div>


            {/* Table */}

            <div className="table-card">

                <div className="table-header">

                    <h3>
                        Supply Orders
                    </h3>

                    <span>
                        {data.length} order
                        {data.length !== 1
                            ? "s"
                            : ""}
                    </span>

                </div>


                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>#</th>
                                <th>Order Number</th>
                                <th>Supplier</th>
                                <th>Order Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >
                                        Loading...
                                    </td>
                                </tr>

                            ) : data.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >
                                        No supply orders found
                                    </td>
                                </tr>

                            ) : (

                                data.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            {/* Number */}

                                            <td className="td-number">
                                                {(currentPage - 1) *
                                                    10 +
                                                    index +
                                                    1}
                                            </td>


                                            {/* Order Number */}

                                            <td>

                                                <span className="identity">
                                                    {
                                                        item.order_number
                                                    }
                                                </span>

                                            </td>


                                            {/* Supplier */}

                                            <td>
                                                {
                                                    item.supplier_identity ||
                                                    "-"
                                                }
                                            </td>


                                            {/* Order Date */}

                                            <td>
                                                {formatDate(
                                                    item.order_date
                                                )}
                                            </td>


                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={`status ${item.status}`}
                                                >

                                                    <span className="status-dot" />

                                                    {getStatusLabel(
                                                        item.status
                                                    )}

                                                </span>

                                            </td>


                                            {/* Actions */}

                                            <td>

                                                <div className="actions">

                                                    {/* View */}

                                                    <button
                                                        className="action-button view-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/supply/details/${item.id}`
                                                            )
                                                        }
                                                        title="View Supply Order"
                                                    >
                                                        <Eye
                                                            size={16}
                                                        />
                                                    </button>


                                                    {/* Edit */}

                                                    {item.status !==
                                                        "received" &&
                                                        item.status !==
                                                            "cancelled" && (

                                                            <button
                                                                className="action-button edit-button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/supply/add/${item.id}`
                                                                    )
                                                                }
                                                                title="Edit Supply Order"
                                                            >
                                                                <Pencil
                                                                    size={16}
                                                                />
                                                            </button>

                                                        )}


                                                    {/* Receive */}

                                                    {item.status !==
                                                        "received" &&
                                                        item.status !==
                                                            "cancelled" && (

                                                            <button
                                                                className="action-button receive-button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/supply/receive/${item.id}`
                                                                    )
                                                                }
                                                                title="Receive Stock"
                                                            >
                                                                <PackageCheck
                                                                    size={16}
                                                                />
                                                            </button>

                                                        )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* Footer */}

                {!loading &&
                    data.length > 0 && (

                        <div className="table-footer">

                            <span className="result-text">
                                {data.length} results
                            </span>

                            <Pagination
                                currentPage={
                                    currentPage
                                }
                                totalPages={
                                    totalPages
                                }
                                onPageChange={
                                    setCurrentPage
                                }
                            />

                        </div>

                    )}

            </div>

        </div>
    );
};

export default SupplyList;