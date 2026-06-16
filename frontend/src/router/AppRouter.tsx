import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ManagerLayout } from "../layouts/ManagerLayout";
import { RequireRole } from "./RequireRole";

// Public Pages
import { HomePage } from "../pages/public/HomePage";
import { ExplorePage } from "../pages/public/ExplorePage";
import { SpatialEntityDetailPage } from "../pages/public/SpatialEntityDetailPage";
import { IntroPage } from "../pages/public/IntroPage";
import { SearchPage } from "../pages/public/SearchPage";
import { LoginPage } from "../pages/public/LoginPage";
import { RegisterPage } from "../pages/public/RegisterPage";

// Admin Pages
import { DashboardPage } from "../pages/admin/DashboardPage";
import { LayersPage } from "../pages/admin/LayersPage";
import { EntitiesPage } from "../pages/admin/EntitiesPage";
import { EntityDetailPage as AdminEntityDetailPage } from "../pages/admin/EntityDetailPage";
import { CategoriesPage } from "../pages/admin/CategoriesPage";
import { RegionsPage } from "../pages/admin/RegionsPage";
import { UsersPage } from "../pages/admin/UsersPage";

// Manager Pages
import { ManagerDashboardPage } from "../pages/manager/ManagerDashboardPage";
import { ManagerEntitiesPage } from "../pages/manager/ManagerEntitiesPage";

// Shared
import { NotFoundPage } from "../pages/NotFoundPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="explore/:entitySlug" element={<SpatialEntityDetailPage />} />
        <Route path="intro" element={<IntroPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole roles={["admin"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="layers" element={<LayersPage />} />
        <Route path="entities" element={<EntitiesPage />} />
        <Route path="entities/new" element={<AdminEntityDetailPage />} />
        <Route path="entities/:id" element={<AdminEntityDetailPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="regions" element={<RegionsPage />} />
        <Route
          path="users"
          element={
            <RequireRole roles={["admin"]}>
              <UsersPage />
            </RequireRole>
          }
        />
      </Route>

      <Route
        path="/manager"
        element={
          <RequireRole roles={["location_manager"]}>
            <ManagerLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboardPage />} />
        <Route path="entities" element={<ManagerEntitiesPage />} />
        <Route path="entities/new" element={<AdminEntityDetailPage />} />
        <Route path="entities/:id" element={<AdminEntityDetailPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
