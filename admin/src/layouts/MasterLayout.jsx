import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Truck,
    Shirt,
    Layers,
    Ruler,
    Palette,
    Scale,
    Factory,
    Boxes,
    Package,
    ArrowDownUp,
    ClipboardList,
    BarChart3,
    LogOut,
    Menu,
    ChevronLeft,
} from "lucide-react";

import "./MasterLayout.css";
import api from "../apis/base";

const MasterLayout = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("auth/profile/");
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    const getUserName = () => {
        return (
            user.identity ||
            user.name ||
            user.username ||
            user.email ||
            "User"
        );
    };

    const getUserInitial = () => {
        return getUserName().charAt(0).toUpperCase();
    };

    return (
        <div
            className={`erp-layout ${
                collapsed ? "sidebar-collapsed" : ""
            }`}
        >
            <aside className="sidebar">

                <div className="sidebar-logo">
                    <div className="logo-box">
                        ERP
                    </div>

                    {!collapsed && (
                        <div className="logo-content">
                            <h2>Garment ERP</h2>
                            <span>Management System</span>
                        </div>
                    )}
                </div>

                <button
                    className="sidebar-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <Menu size={17} />
                    ) : (
                        <ChevronLeft size={17} />
                    )}
                </button>

                <nav className="sidebar-menu">

                    <div className="menu-section">
                        MAIN
                    </div>

                    <NavLink
                        to="/"
                        end
                        className="menu-item"
                        title="Dashboard"
                    >
                        <LayoutDashboard size={17} />
                        {!collapsed && <span>Dashboard</span>}
                    </NavLink>

                    <div className="menu-section">
                        MASTER DATA
                    </div>

                    <NavLink
                        to="/customers"
                        className="menu-item"
                        title="Customers"
                    >
                        <Users size={17} />
                        {!collapsed && <span>Customers</span>}
                    </NavLink>

                    <NavLink
                        to="/suppliers"
                        className="menu-item"
                        title="Suppliers"
                    >
                        <Truck size={17} />
                        {!collapsed && <span>Suppliers</span>}
                    </NavLink>

                    <NavLink
                        to="/accessory"
                        className="menu-item"
                        title="Accessory"
                    >
                        <Truck size={17} />
                        {!collapsed && <span>Accessory</span>}
                    </NavLink>

                    <NavLink
                        to="/colors"
                        className="menu-item"
                        title="Colors"
                    >
                        <Palette size={17} />
                        {!collapsed && <span>Colors</span>}
                    </NavLink>

                    <NavLink
                        to="/styles"
                        className="menu-item"
                        title="Styles"
                    >
                        <Shirt size={17} />
                        {!collapsed && <span>Styles</span>}
                    </NavLink>

                    <NavLink
                        to="/fabrics"
                        className="menu-item"
                        title="Fabrics"
                    >
                        <Layers size={17} />
                        {!collapsed && <span>Fabrics</span>}
                    </NavLink>

                    <NavLink
                        to="/sizes"
                        className="menu-item"
                        title="Sizes"
                    >
                        <Ruler size={17} />
                        {!collapsed && <span>Sizes</span>}
                    </NavLink>

                    <NavLink
                        to="/units"
                        className="menu-item"
                        title="Units"
                    >
                        <Scale size={17} />
                        {!collapsed && <span>Units</span>}
                    </NavLink>

                    <NavLink
                        to="/seasons"
                        className="menu-item"
                        title="Seasons"
                    >
                        <Factory size={17} />
                        {!collapsed && <span>Seasons</span>}
                    </NavLink>

                    <NavLink
                        to="/bom"
                        className="menu-item"
                        title="BOM"
                    >
                        <Boxes size={17} />
                        {!collapsed && <span>BOM</span>}
                    </NavLink>

                    <div className="menu-section">
                        INVENTORY
                    </div>

                    <NavLink
                        to="/items"
                        className="menu-item"
                        title="Items"
                    >
                        <Package size={17} />
                        {!collapsed && <span>Items</span>}
                    </NavLink>

                    <NavLink
                        to="/stock-log"
                        className="menu-item"
                        title="Stock Transactions"
                    >
                        <ArrowDownUp size={17} />
                        {!collapsed && <span>Stock Transactions</span>}
                    </NavLink>

                    <NavLink
                        to="/supply"
                        className="menu-item"
                        title="Supply Order"
                    >
                        <ArrowDownUp size={17} />
                        {!collapsed && <span>Supply Order</span>}
                    </NavLink>

                    <div className="menu-section">
                        PRODUCTION
                    </div>

                    <NavLink
                        to="/orders"
                        className="menu-item"
                        title="Production Orders"
                    >
                        <ClipboardList size={17} />
                        {!collapsed && <span>Production Orders</span>}
                    </NavLink>

                    <div className="menu-section">
                        REPORTS
                    </div>

                    <NavLink
                        to="/reports"
                        className="menu-item"
                        title="Reports"
                    >
                        <BarChart3 size={17} />
                        {!collapsed && <span>Reports</span>}
                    </NavLink>

                </nav>

                <div className="sidebar-user">

                    <div className="user-avatar">
                        {getUserInitial()}
                    </div>

                    {!collapsed && (
                        <>
                            <div className="user-info">
                                <strong>
                                    {getUserName()}
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
                                <LogOut size={17} />
                            </button>
                        </>
                    )}

                    {collapsed && (
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={17} />
                        </button>
                    )}

                </div>
            </aside>

            <main className="main-content">

                <header className="topbar">

                    <div>
                        <h1>Garment ERP</h1>
                        <p>Manufacturing Management System</p>
                    </div>

                    <div className="topbar-user">
                        {user.email || "User"}
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