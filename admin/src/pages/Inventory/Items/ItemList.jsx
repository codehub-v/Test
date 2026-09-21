
import React, { useEffect, useState } from "react";
import {
    Search,
    Plus,
    Pencil,
    Eye,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Pagination from "../../../components/Pagination";
import api from "../../../apis/base";


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

            const response = await api.get(
                "inventory/items/",
                { params }
            );

            setItems(
                response.data.results || []
            );

            const count =
                response.data.count || 0;

            setTotalPages(
                Math.ceil(count / 10) || 1
            );

        } catch (error) {

            console.error(
                "Failed to fetch inventory items:",
                error
            );

            setItems([]);
            setTotalPages(1);

        } finally {

            setLoading(false);

        }

    };


    const fetchMasterData = async () => {

        try {

            const [
                fabricResponse,
                accessoryResponse,
                colorResponse,
                unitResponse,
            ] = await Promise.all([

                api.get(
                    "master/meta/fabrics/"
                ),

                api.get(
                    "master/meta/accessories/"
                ),

                api.get(
                    "master/meta/colors/"
                ),

                api.get(
                    "master/meta/units/"
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

        const {
            name,
            value,
        } = e.target;

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

        <div style={styles.page}>

            <div style={styles.header}>

                <div style={styles.titleSection}>

                    <h2 style={styles.title}>
                        Inventory Items
                    </h2>

                    <p style={styles.subtitle}>
                        Manage fabrics, accessories and their stock items.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate("/items/add")
                    }
                    style={styles.addButton}
                >

                    <Plus size={18} />

                    Add Item

                </button>

            </div>


            <div style={styles.filterCard}>

                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Search
                    </label>

                    <div style={styles.searchWrapper}>

                        <Search
                            size={17}
                            style={styles.searchIcon}
                        />

                        <input
                            type="text"
                            placeholder="Search item..."
                            value={filters.search}
                            onChange={(e) =>
                                handleFilterChange({
                                    target: {
                                        name: "search",
                                        value: e.target.value,
                                    },
                                })
                            }
                            style={styles.searchInput}
                        />

                    </div>

                </div>


                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Fabric
                    </label>

                    <select
                        name="fabric"
                        value={filters.fabric}
                        onChange={handleFilterChange}
                        style={styles.select}
                    >

                        <option value="">
                            All Fabrics
                        </option>

                        {masterData.fabrics.map(
                            (fabric) => (

                                <option
                                    key={fabric.id}
                                    value={fabric.id}
                                >
                                    {fabric.identity}
                                </option>

                            )
                        )}

                    </select>

                </div>


                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Accessory
                    </label>

                    <select
                        name="accessory"
                        value={filters.accessory}
                        onChange={handleFilterChange}
                        style={styles.select}
                    >

                        <option value="">
                            All Accessories
                        </option>

                        {masterData.accessories.map(
                            (accessory) => (

                                <option
                                    key={accessory.id}
                                    value={accessory.id}
                                >
                                    {accessory.identity}
                                </option>

                            )
                        )}

                    </select>

                </div>


                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Color
                    </label>

                    <select
                        name="color"
                        value={filters.color}
                        onChange={handleFilterChange}
                        style={styles.select}
                    >

                        <option value="">
                            All Colors
                        </option>

                        {masterData.colors.map(
                            (color) => (

                                <option
                                    key={color.id}
                                    value={color.id}
                                >
                                    {color.identity}
                                </option>

                            )
                        )}

                    </select>

                </div>


                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Unit
                    </label>

                    <select
                        name="unit"
                        value={filters.unit}
                        onChange={handleFilterChange}
                        style={styles.select}
                    >

                        <option value="">
                            All Units
                        </option>

                        {masterData.units.map(
                            (unit) => (

                                <option
                                    key={unit.id}
                                    value={unit.id}
                                >
                                    {unit.identity}
                                </option>

                            )
                        )}

                    </select>

                </div>


                <div style={styles.filterGroup}>

                    <label style={styles.filterLabel}>
                        Status
                    </label>

                    <select
                        name="is_active"
                        value={filters.is_active}
                        onChange={handleFilterChange}
                        style={styles.select}
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="true">
                            Active
                        </option>

                        <option value="false">
                            Inactive
                        </option>

                    </select>

                </div>


                <button
                    type="button"
                    onClick={clearFilters}
                    style={styles.clearButton}
                >

                    <X size={16} />

                    Clear

                </button>

            </div>


            <div style={styles.card}>

                <div style={styles.tableWrapper}>

                    <table style={styles.table}>

                        <thead>

                            <tr>

                                <th style={styles.th}>
                                    #
                                </th>

                                <th style={styles.th}>
                                    Fabric
                                </th>

                                <th style={styles.th}>
                                    Accessory
                                </th>

                                <th style={styles.th}>
                                    Color
                                </th>

                                <th style={styles.th}>
                                    Unit
                                </th>

                                <th style={styles.th}>
                                    Current Stock
                                </th>

                                <th style={styles.th}>
                                    Status
                                </th>

                                <th style={styles.th}>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={styles.empty}
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : items.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={styles.empty}
                                    >
                                        No inventory items found
                                    </td>

                                </tr>

                            ) : (

                                items.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.uuid ||
                                                item.id
                                            }
                                        >

                                            <td
                                                style={{
                                                    ...styles.td,
                                                    color: "#94a3b8",
                                                }}
                                            >

                                                {(currentPage - 1) *
                                                    10 +
                                                    index +
                                                    1}

                                            </td>


                                            <td style={styles.td}>
                                                {item.fabric || "-"}
                                            </td>


                                            <td style={styles.td}>
                                                {item.accessory || "-"}
                                            </td>


                                            <td style={styles.td}>
                                                {item.color || "-"}
                                            </td>


                                            <td style={styles.td}>
                                                {item.unit || "-"}
                                            </td>


                                            <td style={styles.td}>
                                                {item.quantity ?? 0}
                                            </td>


                                            <td style={styles.td}>

                                                <span
                                                    style={{
                                                        ...styles.status,
                                                        ...(item.is_active
                                                            ? styles.active
                                                            : styles.inactive),
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            ...styles.statusDot,
                                                            ...(item.is_active
                                                                ? styles.activeDot
                                                                : styles.inactiveDot),
                                                        }}
                                                    />

                                                    {item.is_active
                                                        ? "Active"
                                                        : "Inactive"}

                                                </span>

                                            </td>


                                            <td style={styles.td}>

                                                <div
                                                    style={
                                                        styles.actions
                                                    }
                                                >

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/items/details/${item.id}`
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.actionButton,
                                                            ...styles.viewButton,
                                                        }}
                                                        title="View Item"
                                                    >

                                                        <Eye
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/items/add/${item.id}`
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.actionButton,
                                                            ...styles.editButton,
                                                        }}
                                                        title="Edit Item"
                                                    >

                                                        <Pencil
                                                            size={16}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {!loading &&
                    items.length > 0 && (

                        <div style={styles.footer}>

                            <span style={styles.resultText}>
                                {items.length} results
                            </span>

                            <Pagination
                                currentPage={
                                    currentPage
                                }
                                totalPages={
                                    totalPages > 0
                                        ? totalPages
                                        : 1
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

    filterCard: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "18px",
        display: "flex",
        alignItems: "flex-end",
        gap: "16px",
        marginBottom: "20px",
        boxShadow:
            "0 1px 3px rgba(15, 23, 42, 0.04)",
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

    card: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow:
            "0 1px 3px rgba(15, 23, 42, 0.04)",
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

    viewButton: {
        color: "#0f766e",
        backgroundColor: "#f0fdfa",
        border: "1px solid #ccfbf1",
    },

    editButton: {
        color: "#4f46e5",
    },

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


export default ItemList;
