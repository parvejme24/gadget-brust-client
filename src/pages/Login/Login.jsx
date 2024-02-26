import React, { useState } from "react";
import "./Login.css";
import login from "../../assets/login.png";

function Login() {
  return (
    <div class="container mx-auto">
      <form>
        <div class="relative float-label-input">
          <input
            type="text"
            placeholder=" "
            className="block bg-white w-full  focus:outline-none focus:shadow-outline border border-green-500 rounded-md py-3 px-4 appearance-none leading-normal"
          />
          <label class="absolute top-3 left-0 text-green-500 pointer-events-none transition duration-200 ease-in-outbg-white px-4">
            Full Name
          </label>
        </div>
      </form>
    </div>
  );
}

export default Login;
