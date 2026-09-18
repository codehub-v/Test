import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import MasterLayout from "./layouts/MasterLayout";

import ColorList from "./pages/Masters/Colors/ColorList";
import CustomerList from "./pages/Masters/Customers/CustomerList";
import CustomerForm from "./pages/Masters/Customers/CustomerForm";
import CustomerDetails from "./pages/Masters/Customers/CustomerDetails";
import SuppliersList from "./pages/Masters/Suppliers/SuppliersList";
import SuppliersForm from "./pages/Masters/Suppliers/SuppliersForm";
import SuppliersDetails from "./pages/Masters/Suppliers/SuppliersDetails";

import FabricList from "./pages/Masters/Fabrics/FabricList";
import StyleList from "./pages/Masters/Styles/StyleList";
import SizeList from "./pages/Masters/Sizes/SizeList";
import SeasonList from "./pages/Masters/Season/SeasonList";
import UnitList from "./pages/Masters/Unit/UnitList";
import AccessoryList from "./pages/Masters/Accessory/AccessoryList";
import BOMList from "./pages/Masters/BOM/BOMList";
import BOMForm from "./pages/Masters/BOM/BOMForm";
import BOMDetails from "./pages/Masters/BOM/BOMDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MasterLayout />}>

                        <Route path="/" element={<Home />} />

                        <Route path="colors" element={<ColorList />} />

                        <Route path="customers" element={<CustomerList />} />
                        <Route path="customers/add" element={<CustomerForm />} />
                        <Route path="customers/add/:id" element={<CustomerForm />} />
                        <Route path="customers/details/:id" element={<CustomerDetails />} />

                        <Route path="suppliers" element={<SuppliersList />} />
                        <Route path="suppliers/add" element={<SuppliersForm />} />
                        <Route path="suppliers/add/:id" element={<SuppliersForm />} />
                        <Route path="suppliers/details/:id" element={<SuppliersDetails />} />

                        <Route path="styles" element={<StyleList />} />
                        <Route path="sizes" element={<SizeList />} />
                        <Route path="fabrics" element={<FabricList />} />
                        <Route path="seasons" element={<SeasonList />} />
                        <Route path="units" element={<UnitList />} />
                        <Route path="accessories" element={<AccessoryList />} />

                        <Route path="bom" element={<BOMList />} />
                        <Route path="bom/add" element={<BOMForm />} />
                        <Route path="bom/add/:id" element={<BOMForm />} />
                        <Route path="bom/details/:id" element={<BOMDetails />} />

                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;