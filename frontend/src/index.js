import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { UserContextProvider } from './contexts/UserContext';

import routes from './routes';
import Layout from './Components/Layout';

const root = ReactDOM.createRoot(document.getElementById("root"));

const generateRoutes = (routes) => {
  return routes.map((route, index) => {
    return { path: route.path, element: React.createElement(route.component) };
  });
};

// nest all app routes under a Layout that renders the persistent NavBar
const router = createBrowserRouter([
  { path: '/', element: React.createElement(Layout), children: generateRoutes(routes) },
]);

root.render(
  <UserContextProvider>
    <RouterProvider router={router} />
  </UserContextProvider>
);
reportWebVitals();
