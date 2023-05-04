import { createTheme } from "@mui/material";
import axios from "axios";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import isLoggedIn from './components/user/isUserLoggedIn';
import { destroySession, getToken, setUser } from './components/user/userStorage';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import EmployerListPage from './views/employer/EmployerListPage';
import EmployerPage from './views/employer/EmployerPage';
import ErrorPage from './views/Error';
import Home from './views/Home';
import JobsPage from './views/jobs/JobsPage';
import LoginPage from './views/user/LoginPage';

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
//const queryClient = new QueryClient();
root.render(
  <Provider store={store}>
        <RouterProvider router={router} />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
