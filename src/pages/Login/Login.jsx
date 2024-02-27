import React, { useState } from "react";
import login from "../../assets/login.png";
import { Link } from "react-router-dom";
import googleIcon from "../../assets/icons/google.png";

function Login() {
  const handleSignUp = () => {};
  const handleGoogleLogin = () => {};
  return (
    <div class="container mx-auto flex items-center justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        <div>
          <div className="space-y-6 ">
            <h2 className="secondaryText text-3xl font-semibold text-center">
              Welcome !
            </h2>
            <button
              onClick={handleGoogleLogin}
              className="buttonShadow rounded-md w-full p-3 text-lg font-semibold flex items-center justify-center gap-3"
            >
              <img src={googleIcon} alt="" />
              Sign up with Google
            </button>
            <div className="flex items-center justify-center gap-5 pb-5">
              <hr className="bg-[#343A40] max-w-[20%] w-[20%]" />
              <p>Or Login with E-mail</p>
              <hr className="bg-[#343A40] max-w-[20%] w-[20%]" />
            </div>
          </div>

          <form onSubmit={handleSignUp}>
            <div class="relative float-label-input">
              <input
                type="email"
                name="email"
                placeholder=" "
                className="block bg-white w-full  focus:outline-none focus:shadow-outline border border-green-500 rounded-md py-3 px-4 appearance-none leading-normal"
              />
              <label class="absolute top-3 left-0 text-green-500 pointer-events-none transition duration-200 ease-in-outbg-white px-4">
                Email Address
              </label>
            </div>
            <div class="relative float-label-input">
              <input
                type="password"
                name="password"
                placeholder=" "
                className="block bg-white w-full  focus:outline-none focus:shadow-outline border border-green-500 rounded-md py-3 px-4 appearance-none leading-normal"
              />
              <label class="absolute top-3 left-0 text-green-500 pointer-events-none transition duration-200 ease-in-outbg-white px-4">
                Password
              </label>
            </div>
            <input
              type="submit"
              value="Login"
              className="w-full secondaryBG hover:bg-[#4b997c] py-3 text-white rounded-md transition duration-200 ease-in-outbg-white"
            />

            <hr className="bg-gray-700 my-10 w-3/4 mx-auto" />

            <p className="text-center">
              New to GadgetHub?{" "}
              <Link
                to={"/register"}
                className="secondaryText hover:text-[#4b997c] hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden md:flex">
          <img src={login} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;
