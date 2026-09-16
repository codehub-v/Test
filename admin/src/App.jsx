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


function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route element={<ProtectedRoute />}>

                    <Route
                        element={<MasterLayout />}
                    >

                        <Route
                            path="/"
                            element={<Home />}
                        />
                        <Route
                            path="colors/"
                            element={<ColorList />}
                        />
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

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;