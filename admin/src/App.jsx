
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import MasterLayout from "./layouts/MasterLayout";

// Colors
import ColorList from "./pages/Masters/Colors/ColorList";

// Customers
import CustomerList from "./pages/Masters/Customers/CustomerList";
import CustomerForm from "./pages/Masters/Customers/CustomerForm";
import CustomerDetails from "./pages/Masters/Customers/CustomerDetails";

// Suppliers
import SuppliersList from "./pages/Masters/Suppliers/SuppliersList";
import SuppliersForm from "./pages/Masters/Suppliers/SuppliersForm";
import SuppliersDetails from "./pages/Masters/Suppliers/SuppliersDetails";


import FabricList from "./pages/Masters/Fabrics/FabricList";
import StyleList from "./pages/Masters/Styles/StyleList";
import SizeList from "./pages/Masters/Sizes/SizeList";


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                    <Route element={<MasterLayout />}>

                        {/* Home */}
                        <Route
                            path="/"
                            element={<Home />}
                        />

                        {/* =========================
                            COLORS
                        ========================= */}
                        <Route
                            path="colors/"
                            element={<ColorList />}
                        />


                        {/* =========================
                            CUSTOMERS
                        ========================= */}
                        <Route
                            path="customers/"
                            element={<CustomerList />}
                        />

                        <Route
                            path="customers/add/"
                            element={<CustomerForm />}
                        />

                        <Route
                            path="customers/add/:id"
                            element={<CustomerForm />}
                        />

                        <Route
                            path="customers/details/:id"
                            element={<CustomerDetails />}
                        />


                        {/* =========================
                            SUPPLIERS
                        ========================= */}
                        <Route
                            path="suppliers/"
                            element={<SuppliersList />}
                        />

                        <Route
                            path="suppliers/add/"
                            element={<SuppliersForm />}
                        />

                        <Route
                            path="suppliers/add/:id"
                            element={<SuppliersForm />}
                        />

                        <Route
                            path="suppliers/details/:id"
                            element={<SuppliersDetails />}
                        />


                        {/* =========================
                            STYLES
                        ========================= */}
                        <Route
                            path="styles/"
                            element={<StyleList />}
                        />




                        {/* =========================
                            SIZES
                        ========================= */}
                        <Route
                            path="sizes/"
                            element={<SizeList />}
                        />



                        {/* =========================
                            FABRICS
                        ========================= */}
                        <Route
                            path="fabrics/"
                            element={<FabricList/>}
                        />


                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
