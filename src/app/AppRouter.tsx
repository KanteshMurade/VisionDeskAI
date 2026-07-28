import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import AIProviders from "../pages/AIProviders";
import OCR from "../pages/OCR";
import Memory from "../pages/Memory";
import Plugins from "../pages/Plugins";
import Settings from "../pages/Settings";
import Chat from "../pages/Chat";
import Capture from "../pages/Capture";

import MainLayout from "../layout/MainLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/providers" element={<MainLayout><AIProviders /></MainLayout>} />
        <Route path="/ocr" element={<MainLayout><OCR /></MainLayout>} />
        <Route path="/memory" element={<MainLayout><Memory /></MainLayout>} />
        <Route path="/plugins" element={<MainLayout><Plugins /></MainLayout>} />
        <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
        <Route path="/chat" element={<MainLayout><Chat /></MainLayout>} />
        <Route path="/capture" element={<MainLayout><Capture /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
