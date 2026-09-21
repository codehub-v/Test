import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  ArrowDownToLine,
  ArrowUpFromLine,
  Package,
} from "lucide-react";
import Pagination from "../../../components/Pagination";
import "./StockLogList.css";

const StockLogList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [params, setParams] = useState({
    search: "",
    ordering: "-transaction_date",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const headers = {
    Authorization: `Token ${localStorage.getItem("token")}`,
  };

  /* =========================
       Fetch Stock Logs
  ========================= */

  const fetchStockLogs = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://127.0.0.1:8000/inventory/stock-logs/",
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

      if (response.data.next) {
        const match = response.data.next.match(/page=(\d+)/);

        if (match) {
          setTotalPages(Number(match[1]));
        }
      } else if (response.data.previous) {
        setTotalPages(currentPage);
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error(
        "Failed to fetch stock logs:",
        error
      );

      setErrorMessage(
        "Unable to load stock logs. Please try again."
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockLogs();
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
       Ordering
  ========================= */

  const handleOrdering = (e) => {
    setCurrentPage(1);

    setParams((prev) => ({
      ...prev,
      ordering: e.target.value,
    }));
  };

  /* =========================
       Reset
  ========================= */

  const resetFilters = () => {
    setParams({
      search: "",
      ordering: "-transaction_date",
    });

    setCurrentPage(1);
  };

  /* =========================
       Page Change
  ========================= */

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="stock-log-page">

      {/* =========================
                Header
      ========================= */}

      <div className="stock-log-header">
        <div>
          <h2>Stock Log</h2>

          <p>
            View inventory stock movement history
          </p>
        </div>
      </div>

      {/* =========================
                Error
      ========================= */}

      {errorMessage && (
        <div className="stock-log-error">
          {errorMessage}
        </div>
      )}

      {/* =========================
                Filters
      ========================= */}

      <div className="stock-log-filter-card">

        <div className="stock-log-search-wrapper">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search code, material, color..."
            value={params.search}
            onChange={handleSearch}
          />
        </div>

        <div className="stock-log-filter-select">
          <select
            value={params.ordering}
            onChange={handleOrdering}
          >
            <option value="-transaction_date">
              Newest First
            </option>

            <option value="transaction_date">
              Oldest First
            </option>

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
          className="stock-log-reset-button"
          onClick={resetFilters}
        >
          <RefreshCw size={15} />
          Reset
        </button>
      </div>

      {/* =========================
                Table
      ========================= */}

      <div className="stock-log-table-card">

        <div className="stock-log-table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Item</th>
                <th>Stock In</th>
                <th>Stock Out</th>
                <th>Remaining Stock</th>
                <th>Notes</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="stock-log-empty"
                  >
                    Loading stock logs...
                  </td>
                </tr>

              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="stock-log-empty"
                  >
                    No stock logs found.
                  </td>
                </tr>

              ) : (
                data.map((log) => (
                  <tr key={log.id}>

                    {/* Item */}

                    <td>
                      <div className="stock-log-item">

                        <div className="stock-log-item-icon">
                          <Package size={16} />
                        </div>

                        <strong>
                          {log.item}
                        </strong>

                      </div>
                    </td>

                    {/* Stock In */}

                    <td>
                      {Number(log.transaction_in) > 0 ? (
                        <span className="stock-in-value">
                          <ArrowDownToLine size={15} />
                          {log.transaction_in}
                        </span>
                      ) : (
                        <span className="stock-zero">
                          0
                        </span>
                      )}
                    </td>

                    {/* Stock Out */}

                    <td>
                      {Number(log.transaction_out) > 0 ? (
                        <span className="stock-out-value">
                          <ArrowUpFromLine size={15} />
                          {log.transaction_out}
                        </span>
                      ) : (
                        <span className="stock-zero">
                          0
                        </span>
                      )}
                    </td>

                    {/* Remaining */}

                    <td>
                      <span className="remaining-value">
                        {log.quantity}
                      </span>
                    </td>

                    {/* Notes */}

                    <td>
                      <span className="stock-log-notes">
                        {log.notes || "-"}
                      </span>
                    </td>

                    {/* Date */}

                    <td>
                      <span className="stock-log-date">
                        {new Date(
                          log.transaction_date
                        ).toLocaleString()}
                      </span>
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

        <div className="stock-log-table-footer">

          <span>

          </span>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

        </div>

      </div>

    </div>
  );
};

export default StockLogList;