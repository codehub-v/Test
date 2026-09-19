
import React from "react";
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
    ShoppingCart,
    Package,
    ArrowDownUp,
    Receipt,
    ClipboardList,
    Scissors,
    Wrench,
    CheckCircle,
    PackageCheck,
    BarChart3,
    LogOut, 
} from "lucide-react";

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
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>


                    {/* MASTER DATA */}

                    <div className="menu-section">
                        MASTER DATA
                    </div>

                    <NavLink
                        to="/customers"
                        className="menu-item"
                    >
                        <Users size={18} />
                        <span>Customers</span>
                    </NavLink>

                    <NavLink
                        to="/suppliers"
                        className="menu-item"
                    >
                        <Truck size={18} />
                        <span>Suppliers</span>
                    </NavLink>
                    <NavLink
                        to="/accessory"
                        className="menu-item"
                    >
                        <Truck size={18} />
                        <span>Accessory</span>
                    </NavLink>

                    <NavLink
                        to="/colors"
                        className="menu-item"
                    >
                        <Palette  size={18} />
                        <span>Colors</span>
                    </NavLink>
                    <NavLink
                        to="/styles"
                        className="menu-item"
                    >
                        <Shirt size={18} />
                        <span>Styles</span>
                    </NavLink>

                    <NavLink
                        to="/fabrics"
                        className="menu-item"
                    >
                        <Layers size={18} />
                        <span>Fabrics</span>
                    </NavLink>

                    <NavLink
                        to="/sizes"
                        className="menu-item"
                    >
                        <Ruler size={18} />
                        <span>Sizes</span>
                    </NavLink>

                    <NavLink
                        to="/units"
                        className="menu-item"
                    >
                        <Scale size={18} />
                        <span>Units</span>
                    </NavLink>

                    <NavLink
                        to="/seasons"
                        className="menu-item"
                    >
                        <Factory size={18} />
                        <span>Seasons</span>
                    </NavLink>

                    <NavLink
                        to="/bom"
                        className="menu-item"
                    >
                        <Boxes size={18} />
                        <span>BOM</span>
                    </NavLink>


                    {/* INVENTORY */}

                    <div className="menu-section">
                        INVENTORY
                    </div>

                    <NavLink
                        to="/items"
                        className="menu-item"
                    >
                        <Package size={18} />
                        <span>Items</span>
                    </NavLink>
                    {/* <NavLink
                        to="/stock"
                        className="menu-item"
                    >
                        <Package size={18} />
                        <span>Stock</span>
                    </NavLink> */}

                    <NavLink
                        to="/stock-log"
                        className="menu-item"
                    >
                        <ArrowDownUp size={18} />
                        <span>Stock Transactions</span>
                    </NavLink>
                    <NavLink
                        to="/supply"
                        className="menu-item"
                    >
                        <ArrowDownUp size={18} />
                        <span>Supply Order</span>
                    </NavLink>


                    {/* PRODUCTION */}

                    <div className="menu-section">
                        PRODUCTION
                    </div>

                    <NavLink
                        to="/production-orders"
                        className="menu-item"
                    >
                        <ClipboardList size={18} />
                        <span>Production Orders</span>
                    </NavLink>

                    <NavLink
                        to="/cutting"
                        className="menu-item"
                    >
                        <Scissors size={18} />
                        <span>Cutting</span>
                    </NavLink>

                    <NavLink
                        to="/sewing"
                        className="menu-item"
                    >
                        <Wrench size={18} />
                        <span>Sewing</span>
                    </NavLink>

                    <NavLink
                        to="/quality"
                        className="menu-item"
                    >
                        <CheckCircle size={18} />
                        <span>Quality</span>
                    </NavLink>

                    <NavLink
                        to="/finished-goods"
                        className="menu-item"
                    >
                        <PackageCheck size={18} />
                        <span>Finished Goods</span>
                    </NavLink>


                    {/* REPORTS */}

                    <div className="menu-section">
                        REPORTS
                    </div>

                    <NavLink
                        to="/reports"
                        className="menu-item"
                    >
                        <BarChart3 size={18} />
                        <span>Reports</span>
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
                        <LogOut size={18} />
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
