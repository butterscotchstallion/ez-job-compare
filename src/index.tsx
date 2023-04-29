import { createTheme } from "@mui/material";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import destroySession from './components/user/destroySession';
import isLoggedIn from './components/user/isUserLoggedIn';
import { setUser } from './components/user/userStorage';
import reportWebVitals from './reportWebVitals';
import EmployerListPage from './views/employer/EmployerListPage';
import EmployerPage from './views/employer/EmployerPage';
import ErrorPage from './views/Error';
import Home from './views/Home';
import JobsPage from './views/jobs/JobsPage';
import LoginPage from './views/user/LoginPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from "axios";
import { getToken } from "./components/user/token";

TimeAgo.addDefaultLocale(en);

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
});

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['x-ezjobcompare-session-token'] = getToken();

// Check user token
isLoggedIn().then((response: any) => {
    const results = response ? response.data.results[0] : null;
    const active = results ? results.active : false;
    if (active) {
      if (results.user) {
        setUser(results.user);
      } else {
        console.error('No user found from session active results');
      }
    } else {
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
    path: '/employers/:employerSlug',
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
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <RouterProvider router={router} />
  </LocalizationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
