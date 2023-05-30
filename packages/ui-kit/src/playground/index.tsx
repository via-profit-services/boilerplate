import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { RouteObject } from "react-router-dom";d

import Introduction from '../playground/Intruduction';
import Buttons from '../playground/Buttons';

const bootstrap = async () => {
  const rootElement = document.getElementById("app");
  if (!rootElement) {
    throw new Error("Root element with id #app not found");
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Introduction />,
    },
    {
      path: "/buttons",
      element: <Buttons />,
    },
  ]);

  const AppData = <RouterProvider router={router} />;

  if (process.env.NODE_ENV !== "development") {
    hydrateRoot(rootElement, AppData);
  }

  if (process.env.NODE_ENV === "development") {
    const root = createRoot(rootElement);
    root.render(AppData);
  }
};

bootstrap();
