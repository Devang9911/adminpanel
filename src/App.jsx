import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../layout/Layout";
import AuditLogs from "./pages/audit/AuditLogs";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Users from "./pages/users/Users";
import Workspace from "./pages/workspaces/Workspace";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Categories from "./components/modules/categories/Categories";
import Features from "./components/modules/features/Features";
import ModulesList from "./components/modules/list/ModulesList";
import Plans from "./components/modules/plans/Plans";
import UserTable from "./components/users/UserTable";
import WorkspaceDetails from "./components/workspace/WorkspaceDetails";
import WorkspaceList from "./components/workspace/WorkspaceList";
import Modules from "./pages/modules/Modules";
import ProtectedRoute from "./routes/ProtectedRoute";
import { getCurrentUser } from "./store/authSlice";
import PlanDetails from "./components/modules/plans/PlanDetails";
import PlanList from "./components/modules/plans/PlanList";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getCurrentUser());
    }
  }, []);
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            marginTop: "10px",
            maxWidth: "90vw",
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="users" element={<Users />}>
            <Route index element={<UserTable />} />
            <Route path="list" element={<UserTable />} />
          </Route>

          <Route path="workspaces" element={<Workspace />}>
            <Route index element={<WorkspaceList />} />
            <Route path="list" element={<WorkspaceList />} />
            <Route path="details/:id" element={<WorkspaceDetails />} />
          </Route>
          <Route path="auditlogs" element={<AuditLogs />} />
          <Route path="modules" element={<Modules />}>
            <Route index element={<ModulesList />} />
            <Route path="moduleslist" element={<ModulesList />} />
            <Route path="categories" element={<Categories />} />
            <Route path="features" element={<Features />} />
            <Route path="plans" element={<Plans />}>
              <Route index element={<PlanList />} />
              <Route path="list" element={<PlanList />} />
              <Route
                path="details/:planId"
                element={<PlanDetails />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
