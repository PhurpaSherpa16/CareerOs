import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/mainlayout";
import Login from "../pages/loginRegister/Login";
import Index from "../pages/Index";
import Register from "../pages/loginRegister/Register";
import UserDashboard from "../pages/userDashboard/UserDashboard";
import Analyzer from "../pages/analyze/Analyzer";
import LoginRegisterLayout from "../layout/LoginRegisterLayout";
import NotFound from "../pages/NotFound";
import UserDashboardLayout from "../layout/UserDashboardLayout";
import AllAnalysis from "../pages/userDashboard/pages/AllAnalysis";
import Resume from "../pages/userDashboard/pages/resume/Resume";


export default function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Index />} />
                <Route path="/analyze" element={<Analyzer />} />
            </Route>
            <Route path="/" element={<LoginRegisterLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            <Route path="/user-dashboard" element={<UserDashboardLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="all-analysis" element={<AllAnalysis />} />
                <Route path="resume" element={<Resume />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}