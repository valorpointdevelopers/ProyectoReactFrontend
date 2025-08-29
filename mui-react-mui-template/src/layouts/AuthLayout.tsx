import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Outlet />
    </div>
  );
}
