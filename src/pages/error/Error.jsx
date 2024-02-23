import React from "react";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-y-3">
        <h2 className="text-center text-9xl font-bold">404</h2>
        <h4 className="text-center text-2xl font-bold">Page not found</h4>
        <div className="flex justify-center">
          <Link to={"/"} className="hover:underline text-xl">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
