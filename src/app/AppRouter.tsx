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
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/providers" element={<AIProviders />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/plugins" element={<Plugins />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/capture" element={<Capture />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
