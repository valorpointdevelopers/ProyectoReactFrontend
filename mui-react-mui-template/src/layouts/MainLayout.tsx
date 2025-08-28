import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // tu menú lateral
import Topbar from "./Topbar";   // tu barra superior

export default function MainLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main style={{ flexGrow: 1, padding: "1rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
