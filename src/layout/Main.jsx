import React from "react";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <div>
      <h2>Navbar</h2>
      <Outlet />
      <p>Footer</p>
    </div>
  );
}
