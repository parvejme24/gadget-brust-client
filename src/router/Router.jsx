import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Error from "../pages/error/Error.jsx";
import Main from "../layout/Main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default router;
