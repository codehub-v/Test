
import React, { useEffect, useState } from "react";
import {
    Package,
    Factory,
    AlertTriangle,
    ShoppingCart,
    ClipboardList,
    CheckCircle2,
    Clock3,
    XCircle,
    Scissors,
    RefreshCw,
} from "lucide-react";

import "./Home.css"
import api from "../../apis/base";
const Home = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("auth/dashboard/");
            setDashboard(response.data);
        } catch (error) {
            setError(
                error?.response?.data?.detail ||
                "Failed to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-error">
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                    <button onClick={fetchDashboard}>
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const summary = dashboard?.summary || {};
    const inventory = dashboard?.inventory || {};
    const supplyOrders = dashboard?.supply_orders || {};
    const production = dashboard?.production || {};

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Overview of inventory, supply orders and production.
                    </p>
                </div>

                <button
                    className="dashboard-refresh"
                    onClick={fetchDashboard}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="summary-grid">

                <div className="summary-card">
                    <div className="summary-icon blue">
                        <ShoppingCart size={20} />
                    </div>

                    <div>
                        <span>Total Supply Orders</span>
                        <strong>
                            {summary.total_supply_orders || 0}
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon purple">
                        <Factory size={20} />
                    </div>

                    <div>
                        <span>Total Production Orders</span>
                        <strong>
                            {summary.total_production_orders || 0}
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon green">
                        <Package size={20} />
                    </div>

                    <div>
                        <span>Total Inventory</span>
                        <strong>
                            {Number(inventory.total_quantity || 0).toLocaleString()}
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-icon orange">
                        <AlertTriangle size={20} />
                    </div>

                    <div>
                        <span>Low Stock Items</span>
                        <strong>
                            {inventory.low_stock_items || 0}
                        </strong>
                    </div>
                </div>

            </div>

            <div className="dashboard-grid">

                <div className="dashboard-card">

                    <div className="card-header">
                        <div>
                            <h2>Supply Orders</h2>
                            <p>Current supply order status</p>
                        </div>

                        <ShoppingCart size={20} />
                    </div>

                    <div className="status-list">

                        <div className="status-row">
                            <div className="status-label">
                                <Clock3 size={17} />
                                <span>Ordered</span>
                            </div>

                            <strong>
                                {supplyOrders.ordered || 0}
                            </strong>
                        </div>

                        <div className="status-row">
                            <div className="status-label">
                                <RefreshCw size={17} />
                                <span>Partial</span>
                            </div>

                            <strong>
                                {supplyOrders.partial || 0}
                            </strong>
                        </div>

                        <div className="status-row">
                            <div className="status-label">
                                <CheckCircle2 size={17} />
                                <span>Received</span>
                            </div>

                            <strong>
                                {supplyOrders.received || 0}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-header">
                        <div>
                            <h2>Production</h2>
                            <p>Current production status</p>
                        </div>

                        <Factory size={20} />
                    </div>

                    <div className="production-grid">

                        <div className="production-status">
                            <div className="production-status-icon waiting">
                                <Clock3 size={17} />
                            </div>

                            <span>Waiting</span>
                            <strong>{production.waiting || 0}</strong>
                        </div>

                        <div className="production-status">
                            <div className="production-status-icon cutting">
                                <Scissors size={17} />
                            </div>

                            <span>Cutting</span>
                            <strong>{production.cutting || 0}</strong>
                        </div>

                        <div className="production-status">
                            <div className="production-status-icon">
                                <Factory size={17} />
                            </div>

                            <span>Stitching</span>
                            <strong>{production.stitching || 0}</strong>
                        </div>

                        <div className="production-status">
                            <div className="production-status-icon">
                                <Factory size={17} />
                            </div>

                            <span>Sewing</span>
                            <strong>{production.sewing || 0}</strong>
                        </div>

                        <div className="production-status">
                            <div className="production-status-icon">
                                <Package size={17} />
                            </div>

                            <span>Finishing</span>
                            <strong>{production.finishing || 0}</strong>
                        </div>

                        <div className="production-status">
                            <div className="production-status-icon completed">
                                <CheckCircle2 size={17} />
                            </div>

                            <span>Completed</span>
                            <strong>{production.completed || 0}</strong>
                        </div>

                        <div className="production-status">
                            <div className="production-status-icon cancelled">
                                <XCircle size={17} />
                            </div>

                            <span>Cancelled</span>
                            <strong>{production.cancelled || 0}</strong>
                        </div>

                    </div>

                </div>

            </div>

            <div className="dashboard-card inventory-card">

                <div className="card-header">
                    <div>
                        <h2>Inventory Overview</h2>
                        <p>Current inventory availability</p>
                    </div>

                    <Package size={20} />
                </div>

                <div className="inventory-overview">

                    <div className="inventory-stat">
                        <span>Total Quantity</span>
                        <strong>
                            {Number(
                                inventory.total_quantity || 0
                            ).toLocaleString()}
                        </strong>
                    </div>

                    <div className="inventory-stat">
                        <span>Low Stock Items</span>
                        <strong className="warning-value">
                            {inventory.low_stock_items || 0}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Home;
