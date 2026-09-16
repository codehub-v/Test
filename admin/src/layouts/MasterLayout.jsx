import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./MasterLayout.css";

const MasterLayout = () => {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    return (
        <div className="erp-layout">

            {/* ================= SIDEBAR ================= */}
            <aside className="sidebar">

                {/* Logo */}
                <div className="sidebar-logo">

                    <div className="logo-box">
                        ERP
                    </div>

                    <div>
                        <h2>Garment ERP</h2>
                        <span>Management System</span>
                    </div>

                </div>


                {/* Navigation */}
                <nav className="sidebar-menu">

                    {/* MAIN */}
                    <div className="menu-section">
                        MAIN
                    </div>

                    <NavLink
                        to="/"
                        end
                        className="menu-item"
                    >
                        <span>▦</span>
                        Dashboard
                    </NavLink>


                    {/* MASTER DATA */}
                    <div className="menu-section">
                        MASTER DATA
                    </div>

                    <NavLink
                        to="/customers"
                        className="menu-item"
                    >
                        <span>●</span>
                        Customers
                    </NavLink>

                    <NavLink
                        to="/suppliers"
                        className="menu-item"
                    >
                        <span>●</span>
                        Suppliers
                    </NavLink>

                    <NavLink
                        to="/styles"
                        className="menu-item"
                    >
                        <span>◈</span>
                        Styles
                    </NavLink>

                    <NavLink
                        to="/fabrics"
                        className="menu-item"
                    >
                        <span>▤</span>
                        Fabrics
                    </NavLink>

                    <NavLink
                        to="/sizes"
                        className="menu-item"
                    >
                        <span>◫</span>
                        Sizes
                    </NavLink>

                    <NavLink
                        to="/colors"
                        className="menu-item"
                    >
                        <span>●</span>
                        Colors
                    </NavLink>

                    <NavLink
                        to="/units"
                        className="menu-item"
                    >
                        <span>◫</span>
                        Units
                    </NavLink>

                    <NavLink
                        to="/production-lines"
                        className="menu-item"
                    >
                        <span>▥</span>
                        Production Lines
                    </NavLink>

                    <NavLink
                        to="/bom"
                        className="menu-item"
                    >
                        <span>◈</span>
                        BOM
                    </NavLink>


                    {/* PURCHASE */}
                    <div className="menu-section">
                        PURCHASE
                    </div>

                    <NavLink
                        to="/purchase-orders"
                        className="menu-item"
                    >
                        <span>▤</span>
                        Purchase Orders
                    </NavLink>


                    {/* INVENTORY */}
                    <div className="menu-section">
                        INVENTORY
                    </div>

                    <NavLink
                        to="/stock"
                        className="menu-item"
                    >
                        <span>▦</span>
                        Stock
                    </NavLink>

                    <NavLink
                        to="/stock-transactions"
                        className="menu-item"
                    >
                        <span>↕</span>
                        Stock Transactions
                    </NavLink>


                    {/* SALES */}
                    <div className="menu-section">
                        SALES
                    </div>

                    <NavLink
                        to="/sales-orders"
                        className="menu-item"
                    >
                        <span>▣</span>
                        Sales Orders
                    </NavLink>


                    {/* PRODUCTION */}
                    <div className="menu-section">
                        PRODUCTION
                    </div>

                    <NavLink
                        to="/production-orders"
                        className="menu-item"
                    >
                        <span>▥</span>
                        Production Orders
                    </NavLink>

                    <NavLink
                        to="/cutting"
                        className="menu-item"
                    >
                        <span>✂</span>
                        Cutting
                    </NavLink>

                    <NavLink
                        to="/sewing"
                        className="menu-item"
                    >
                        <span>⚒</span>
                        Sewing
                    </NavLink>

                    <NavLink
                        to="/quality"
                        className="menu-item"
                    >
                        <span>✓</span>
                        Quality
                    </NavLink>

                    <NavLink
                        to="/finished-goods"
                        className="menu-item"
                    >
                        <span>▤</span>
                        Finished Goods
                    </NavLink>


                    {/* REPORTS */}
                    <div className="menu-section">
                        REPORTS
                    </div>

                    <NavLink
                        to="/reports"
                        className="menu-item"
                    >
                        <span>▥</span>
                        Reports
                    </NavLink>

                </nav>


                {/* ================= USER ================= */}
                <div className="sidebar-user">

                    <div className="user-avatar">
                        {(user.identity || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="user-info">

                        <strong>
                            {user.identity || "User"}
                        </strong>

                        <span>
                            {user.role || "User"}
                        </span>

                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        ↪
                    </button>

                </div>

            </aside>


            {/* ================= MAIN ================= */}
            <main className="main-content">

                <header className="topbar">

                    <div>
                        <h1>Garment ERP</h1>

                        <p>
                            Manufacturing Management System
                        </p>
                    </div>

                    <div className="topbar-user">
                        {user.email}
                    </div>

                </header>


                <section className="page-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
};

export default MasterLayout;