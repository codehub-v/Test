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

    const hasPermission = (permission) => {
        if (user.is_superuser) {
            return true;
        }

        return user.role_details?.[permission] === true;
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
                    title={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
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

                    {hasPermission("customer") && (
                        <NavLink
                            to="/customers"
                            className="menu-item"
                            title="Customers"
                        >
                            <Users size={17} />
                            {!collapsed && <span>Customers</span>}
                        </NavLink>
                    )}

                    {hasPermission("supplier") && (
                        <NavLink
                            to="/suppliers"
                            className="menu-item"
                            title="Suppliers"
                        >
                            <Truck size={17} />
                            {!collapsed && <span>Suppliers</span>}
                        </NavLink>
                    )}

                    {hasPermission("accessory") && (
                        <NavLink
                            to="/accessory"
                            className="menu-item"
                            title="Accessory"
                        >
                            <Truck size={17} />
                            {!collapsed && <span>Accessory</span>}
                        </NavLink>
                    )}

                    {hasPermission("color") && (
                        <NavLink
                            to="/colors"
                            className="menu-item"
                            title="Colors"
                        >
                            <Palette size={17} />
                            {!collapsed && <span>Colors</span>}
                        </NavLink>
                    )}

                    {hasPermission("style") && (
                        <NavLink
                            to="/styles"
                            className="menu-item"
                            title="Styles"
                        >
                            <Shirt size={17} />
                            {!collapsed && <span>Styles</span>}
                        </NavLink>
                    )}

                    {hasPermission("fabric") && (
                        <NavLink
                            to="/fabrics"
                            className="menu-item"
                            title="Fabrics"
                        >
                            <Layers size={17} />
                            {!collapsed && <span>Fabrics</span>}
                        </NavLink>
                    )}

                    {hasPermission("size") && (
                        <NavLink
                            to="/sizes"
                            className="menu-item"
                            title="Sizes"
                        >
                            <Ruler size={17} />
                            {!collapsed && <span>Sizes</span>}
                        </NavLink>
                    )}

                    {hasPermission("unit") && (
                        <NavLink
                            to="/units"
                            className="menu-item"
                            title="Units"
                        >
                            <Scale size={17} />
                            {!collapsed && <span>Units</span>}
                        </NavLink>
                    )}

                    {hasPermission("season") && (
                        <NavLink
                            to="/seasons"
                            className="menu-item"
                            title="Seasons"
                        >
                            <Factory size={17} />
                            {!collapsed && <span>Seasons</span>}
                        </NavLink>
                    )}

                    {hasPermission("bom") && (
                        <NavLink
                            to="/bom"
                            className="menu-item"
                            title="BOM"
                        >
                            <Boxes size={17} />
                            {!collapsed && <span>BOM</span>}
                        </NavLink>
                    )}

                    <div className="menu-section">
                        INVENTORY
                    </div>

                    {hasPermission("inventory") && (
                        <NavLink
                            to="/items"
                            className="menu-item"
                            title="Items"
                        >
                            <Package size={17} />
                            {!collapsed && <span>Items</span>}
                        </NavLink>
                    )}

                    {hasPermission("stock") && (
                        <NavLink
                            to="/stock-log"
                            className="menu-item"
                            title="Stock Transactions"
                        >
                            <ArrowDownUp size={17} />
                            {!collapsed && (
                                <span>Stock Transactions</span>
                            )}
                        </NavLink>
                    )}

                    {hasPermission("supply_order") && (
                        <NavLink
                            to="/supply"
                            className="menu-item"
                            title="Supply Order"
                        >
                            <Truck size={17} />
                            {!collapsed && (
                                <span>Supply Order</span>
                            )}
                        </NavLink>
                    )}

                    <div className="menu-section">
                        PRODUCTION
                    </div>

                    {hasPermission("production") && (
                        <NavLink
                            to="/orders"
                            className="menu-item"
                            title="Production Orders"
                        >
                            <ClipboardList size={17} />
                            {!collapsed && (
                                <span>Production Orders</span>
                            )}
                        </NavLink>
                    )}

                    {hasPermission("delivery") && (
                        <NavLink
                            to="/deliveries"
                            className="menu-item"
                            title="Delivery"
                        >
                            <Truck size={17} />
                            {!collapsed && <span>Delivery</span>}
                        </NavLink>
                    )}

                    <div className="menu-section">
                        REPORTS
                    </div>

                    {hasPermission("reports") && (
                        <NavLink
                            to="/reports"
                            className="menu-item"
                            title="Reports"
                        >
                            <BarChart3 size={17} />
                            {!collapsed && <span>Reports</span>}
                        </NavLink>
                    )}

                    <div className="menu-section">
                        SYSTEM
                    </div>

                    {hasPermission("users") && (
                        <NavLink
                            to="/users"
                            className="menu-item"
                            title="Users"
                        >
                            <Users size={17} />
                            {!collapsed && <span>Users</span>}
                        </NavLink>
                    )}

                    {hasPermission("roles") && (
                        <NavLink
                            to="/roles"
                            className="menu-item"
                            title="Roles"
                        >
                            <Users size={17} />
                            {!collapsed && <span>Roles</span>}
                        </NavLink>
                    )}

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
                                    {user.role_details?.identity ||
                                        "User"}
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