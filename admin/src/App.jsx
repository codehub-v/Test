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
                            path="customers/"
                            element={<ColorList />}
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;