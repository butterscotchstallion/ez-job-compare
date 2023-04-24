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
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import LoginPage from './views/user/LoginPage';
import isLoggedIn from './components/user/isUserLoggedIn';
import { getToken } from './components/user/token';
import destroySession from './components/user/destroySession';
import { getUser } from './components/user/userStorage';

TimeAgo.addDefaultLocale(en);

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

// Check user token
isLoggedIn().then((response: any) => {
    if (response === false || (response && !response.data.results[0].active)) {
      console.info('Destroying user session for inactive session');
      destroySession();
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
  {
    path: '/user/login',
    element: <LoginPage theme={theme} />
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
