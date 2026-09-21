import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Edit,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import Pagination from "../../../components/Pagination";
import "./StockList.css";
import StockFormModal from "./StockFormModal";

const StockList = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [params, setParams] = useState({
    search: "",
    quantity_min: "",
    quantity_max: "",
    ordering: "-quantity",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Stock modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);

  const headers = {
    Authorization: `Token ${localStorage.getItem("token")}`,
  };

  /* =========================
       Fetch Stock
  ========================= */

  const fetchStock = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://127.0.0.1:8000/inventory/stock/",
        {
          headers,
          params: {
            ...params,
            page: currentPage,
          },
        }
      );

      const results = response.data.results || [];

      setData(results);
      setTotalCount(response.data.count || 0);

      /*
       * DRF pagination
       *
       * If your backend uses a fixed PAGE_SIZE,
       * you can simply calculate:
       *
       * Math.ceil(count / PAGE_SIZE)
       *
       * For now, determine the page count from
       * next/previous links.
       */
      if (response.data.count) {
        if (response.data.next) {
          const nextMatch =
            response.data.next.match(/page=(\d+)/);

          if (nextMatch) {
            const nextPage = Number(nextMatch[1]);
            setTotalPages(nextPage);
          }
        } else if (response.data.previous) {
          /*
           * If we are on the last page, use the
           * current page as the total page count.
           */
          setTotalPages(currentPage);
        } else {
          setTotalPages(1);
        }
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch stock:", error);

      setErrorMessage(
        "Unable to load stock. Please try again."
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [params, currentPage]);

  /* =========================
       Search
  ========================= */

  const handleSearch = (e) => {
    setCurrentPage(1);

    setParams((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  /* =========================
       Filter
  ========================= */

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setCurrentPage(1);

    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
       Ordering
  ========================= */

  const handleOrdering = (value) => {
    setCurrentPage(1);

    setParams((prev) => ({
      ...prev,
      ordering: value,
    }));
  };

  /* =========================
       Reset Filters
  ========================= */

  const resetFilters = () => {
    setParams({
      search: "",
      quantity_min: "",
      quantity_max: "",
      ordering: "-quantity",
    });

    setCurrentPage(1);
  };

  /* =========================
       Page Change
  ========================= */

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /* =========================
       Add Stock
  ========================= */

  const handleAddStock = () => {
    setEditingStockId(null);
    setIsStockModalOpen(true);
  };

  /* =========================
       Edit Stock
  ========================= */

  const handleEditStock = (stockId) => {
    setEditingStockId(stockId);
    setIsStockModalOpen(true);
  };

  /* =========================
       Modal Success
  ========================= */

  const handleStockSuccess = () => {
    fetchStock();
  };

  /* =========================
       Close Modal
  ========================= */

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setEditingStockId(null);
  };

  return (
    <div className="stock-list-page">

      {/* =========================
                Header
      ========================= */}

      <div className="stock-list-header">
        <div>
          <h2>Stock</h2>

          <p>Manage current inventory stock</p>
        </div>

        <button
          className="stock-add-button"
          onClick={handleAddStock}
        >
          <Plus size={17} />
          Add Stock
        </button>
      </div>

      {/* =========================
                Error
      ========================= */}

      {errorMessage && (
        <div className="stock-error">
          {errorMessage}
        </div>
      )}

      {/* =========================
                Filters
      ========================= */}

      <div className="stock-filter-card">

        <div className="stock-search-wrapper">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search code, material, color..."
            value={params.search}
            onChange={handleSearch}
          />
        </div>

        <div className="stock-filter-group">
          <input
            type="number"
            name="quantity_min"
            placeholder="Min Qty"
            value={params.quantity_min}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="quantity_max"
            placeholder="Max Qty"
            value={params.quantity_max}
            onChange={handleFilterChange}
          />
        </div>

        <div className="stock-filter-select">
          <SlidersHorizontal size={16} />

          <select
            value={params.ordering}
            onChange={(e) =>
              handleOrdering(e.target.value)
            }
          >
            <option value="-quantity">
              Highest Stock
            </option>

            <option value="quantity">
              Lowest Stock
            </option>
          </select>
        </div>

        <button
          type="button"
          className="stock-reset-button"
          onClick={resetFilters}
        >
          <RefreshCw size={15} />
          Reset
        </button>
      </div>

      {/* =========================
                Table Card
      ========================= */}

      <div className="stock-table-card">

        <div className="stock-table-wrapper">
          <table>

            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Supply Waiting</th>
                <th>Production Requirement</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="stock-empty"
                  >
                    Loading stock...
                  </td>
                </tr>

              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="stock-empty"
                  >
                    No stock found.
                  </td>
                </tr>

              ) : (
                data.map((stock) => (
                  <tr key={stock.id}>

                    {/* Item */}

                    <td>
                      <div className="stock-item-name">
                        <strong>
                          {stock.item}
                        </strong>
                      </div>
                    </td>

                    {/* Quantity */}

                    <td>
                      <span className="quantity-value">
                        {stock.quantity}
                      </span>
                    </td>

                    {/* Supply Waiting */}

                    <td>
                      <span className="waiting-value">
                        {stock.supply_waiting ?? 0}
                      </span>
                    </td>

                    {/* Production Requirement */}

                    <td>
                      <span className="waiting-value">
                        {stock.production_requirement ?? 0}
                      </span>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="stock-actions">

                        <button
                          type="button"
                          title="View"
                          onClick={() =>
                            navigate(
                              `/stock/details/${stock.id}`
                            )
                          }
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            handleEditStock(stock.id)
                          }
                        >
                          <Edit size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

        {/* =========================
                    Footer
        ========================= */}

        <div className="stock-table-footer">

          <span>

          </span>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>

      </div>

      {/* =========================
                Stock Modal
      ========================= */}

      <StockFormModal
        isOpen={isStockModalOpen}
        onClose={handleCloseStockModal}
        stockId={editingStockId}
        onSuccess={handleStockSuccess}
      />

    </div>
  );
};

export default StockList;