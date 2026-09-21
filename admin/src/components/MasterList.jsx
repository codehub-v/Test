import React from "react";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
} from "lucide-react";

import "./MasterList.css";
import Pagination from "./Pagination";


const MasterList = ({
    title,
    subtitle,
    searchPlaceholder = "Search...",
    data = [],
    search,
    setSearch,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    columns = [],
    onAdd,
    onEdit,
    onDelete,
    loading = false,
    emptyMessage = "No records found",
    showStatus = true,
    showDelete = false,
}) => {

    const handleClear = () => {
        setSearch("");
        setStatus("");
        setCurrentPage(1);
    };


    return (
        <div className="master-page">

            {/* ================= HEADER ================= */}

            <div className="master-header">

                <div className="master-title-section">

                    <h2 className="master-title">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="master-subtitle">
                            {subtitle}
                        </p>
                    )}

                </div>


                <button
                    type="button"
                    className="master-add-button"
                    onClick={onAdd}
                >
                    <Plus size={18} />
                    Add {title?.replace(/s$/, "")}
                </button>

            </div>


            {/* ================= FILTER ================= */}

            <div className="master-filter-card">

                {/* Search */}

                <div className="master-filter-group">

                    <label className="master-filter-label">
                        Search
                    </label>

                    <div className="master-search-wrapper">

                        <Search
                            size={17}
                            className="master-search-icon"
                        />

                        <input
                            type="text"
                            value={search}
                            placeholder={searchPlaceholder}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="master-search-input"
                        />

                    </div>

                </div>


                {/* Status */}

                {showStatus && (
                    <div className="master-filter-group">

                        <label className="master-filter-label">
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="master-select"
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
                )}


                {/* Clear */}

                <button
                    type="button"
                    className="master-clear-button"
                    onClick={handleClear}
                >
                    <X size={16} />
                    Clear
                </button>

            </div>


            {/* ================= TABLE CARD ================= */}

            <div className="master-card">

                <div className="master-table-wrapper">

                    <table className="master-table">

                        {/* ================= TABLE HEADER ================= */}

                        <thead>

                            <tr>

                                <th className="master-th">
                                    #
                                </th>

                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="master-th"
                                    >
                                        {column.label}
                                    </th>
                                ))}

                                <th className="master-th">
                                    Status
                                </th>

                                <th className="master-th">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* ================= TABLE BODY ================= */}

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={
                                            columns.length + 3
                                        }
                                        className="master-empty"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : data.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={
                                            columns.length + 3
                                        }
                                        className="master-empty"
                                    >
                                        {emptyMessage}
                                    </td>

                                </tr>

                            ) : (

                                data.map((item, index) => (

                                    <tr
                                        key={item.id}
                                        className="master-row"
                                    >

                                        {/* Number */}

                                        <td
                                            className="master-td master-number"
                                        >
                                            {(currentPage - 1) * 10 +
                                                index +
                                                1}
                                        </td>


                                        {/* Dynamic columns */}

                                        {columns.map((column) => (

                                            <td
                                                key={column.key}
                                                className="master-td"
                                            >

                                                {column.render
                                                    ? column.render(
                                                        item
                                                    )
                                                    : item[
                                                        column.key
                                                    ]}

                                            </td>

                                        ))}


                                        {/* Status */}

                                        <td className="master-td">

                                            <span
                                                className={
                                                    item.is_active
                                                        ? "master-status master-active"
                                                        : "master-status master-inactive"
                                                }
                                            >

                                                <span
                                                    className={
                                                        item.is_active
                                                            ? "master-status-dot master-active-dot"
                                                            : "master-status-dot master-inactive-dot"
                                                    }
                                                />

                                                {item.is_active
                                                    ? "Active"
                                                    : "Inactive"}

                                            </span>

                                        </td>


                                        {/* Actions */}

                                        <td className="master-td">

                                            <div className="master-actions">

                                                {/* Edit */}

                                                <button
                                                    type="button"
                                                    className="master-action-button master-edit-button"
                                                    onClick={() =>
                                                        onEdit?.(item)
                                                    }
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>


                                                {/* Delete */}

                                                {showDelete && (
                                                    <button
                                                        type="button"
                                                        className="master-action-button master-delete-button"
                                                        onClick={() =>
                                                            onDelete?.(item)
                                                        }
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="master-footer">

                    <span className="master-result-text">

                        {data.length}{" "}
                        {data.length === 1
                            ? "result"
                            : "results"}

                    </span>


                    <Pagination
                        currentPage={currentPage}
                        totalPages={
                            totalPages > 0
                                ? totalPages
                                : 1
                        }
                        onPageChange={setCurrentPage}
                    />

                </div>

            </div>

        </div>
    );
};


export default MasterList;