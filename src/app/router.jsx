import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./AppShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../features/auth/LoginPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { StatsPage } from "../features/stats/StatsPage";
import { ClientsPage } from "../features/clients/ClientsPage";
import { ClientDetailPage } from "../features/clients/ClientDetailPage";
import { ScanPage } from "../features/clients/ScanPage";
import { AccountingPage } from "../features/accounting/AccountingPage";
import { MyRequestsPage } from "../features/requests/MyRequestsPage";
import { EmployeeRequestsPage } from "../features/requests/EmployeeRequestsPage";
import { ChatbotPage } from "../features/chatbot/ChatbotPage";
import { ToastHost } from "../components/ui/Toast";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ToastHost />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/scan" element={<ScanPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/accounting" element={<Navigate to="/accounting/tunisia" replace />} />
            <Route path="/accounting/tunisia" element={<AccountingPage defaultCountry="tunisia" />} />
            <Route path="/accounting/libya" element={<AccountingPage defaultCountry="libya" />} />
            <Route path="/MyRequests" element={<MyRequestsPage />} />
            <Route path="/EmployeeRequests" element={<EmployeeRequestsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
