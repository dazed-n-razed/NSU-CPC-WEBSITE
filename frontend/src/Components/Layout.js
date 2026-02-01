import React from "react";
import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const hideNavPaths = ["/", "/home", "/login", "/user-register", "/corporate-register", "/select-reg-type", "/authredirect"];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {!shouldHideNav && <NavBar />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
