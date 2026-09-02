import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import Login from "../pages/loginRegister/Login";
import Index from "../pages/Index";
import Register from "../pages/loginRegister/Register";
import UserDashboard from "../pages/userDashboard/UserDashboard";
import Analyzer from "../pages/analyze/Analyzer";
import LoginRegisterLayout from "../layout/LoginRegisterLayout";


export default function MainRoutes(){
    return(
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<Index/>}/>
                <Route path="/user-dashboard" element={<UserDashboard/>}/>
                <Route path="/analyze" element={<Analyzer/>}/>
            </Route>
            <Route path="/" element={<LoginRegisterLayout/>}>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Route>
        </Routes>
    )
}