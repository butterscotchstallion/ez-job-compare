import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './views/Home';
import ErrorPage from './views/Error';
import EmployerPage from './views/employer/EmployerPage';
import { createTheme } from "@mui/material";
import EmployerListPage from './views/employer/EmployerListPage';
import JobsPage from './views/jobs/JobsPage';

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home theme={theme} />,
    errorElement: <ErrorPage />
  },
  {
    path: "/employers",
    element: <EmployerListPage theme={theme} />
  },
  {
    path: '/employers/tag/:tagSlug',
    element: <EmployerListPage theme={theme} />
  },
  {
    path: '/employers/:employerId',
    element: <EmployerPage theme={theme} />
  },
  {
    path: '/jobs',
    element: <JobsPage theme={theme} />
  }, 
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
