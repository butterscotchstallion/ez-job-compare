import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import './login.scss';
import login from "../../components/user/login";
import { useNavigate } from "react-router-dom";
import URLS from "../../utils/urls";
import { setToken, setUser } from "../../components/user/userStorage";
import isLoggedIn from "../../components/user/isUserLoggedIn";
import { setCredentials } from "../../components/user/authSlice";
import { useDispatch } from "react-redux";

export default function LoginPage({ theme, store }: any) {
    const [loginError, setLoginError] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'Log in';
    }, []);

    function updatePassword(password: string) {
        setPassword(password);
        if (username && password) {
            setButtonDisabled(false);
        }
    }

    function updateUsername(username: string) {
        setUsername(username);
        if (username && password) {
            setButtonDisabled(false);
        }
    }

    function onSubmit(e: any) {
        e.preventDefault();
        setButtonDisabled(true);
        setLoading(true);

        login(username, password).then((response: any) => {
            if (response.data.status === 'OK') {
                const token = response.data.results[0].token;
                const user = response.data.results[0].user;
                if (token && user) {
                    dispatch(setCredentials({
                        user: user, 
                        token: token
                    }));
                    navigate(URLS().jobsPage);
                } else {
                    setLoginError('Invalid token returned from API!');
                }
            } else {
                setLoginError(response.data.message);
            }
        }).catch((error: any) => {
            setLoginError(error.message);
        }).finally(() => {
            setLoading(false);
            setButtonDisabled(false);
        });
    }

    return (
        <Layout theme={theme} store={store} areaTitle="Login">
            <Grid container>
                <Grid item xs={6}>
                    {loginError ? (
                        <Alert severity="error">{loginError}</Alert>
                    ) : ''}                    

                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={onSubmit}
                        className="login-form"
                        >
                            <div>
                                <TextField
                                    required
                                    label="Username"
                                    onChange={(e) => updateUsername(e.target.value)}
                                    />
                            </div>
                            <div>
                                <TextField
                                    required
                                    type="password"
                                    label="Password"
                                    onChange={(e) => updatePassword(e.target.value)}
                                    />
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    className="login-button"
                                    disabled={buttonDisabled}
                                    variant="outlined">
                                        {loading ? 'Logging in...' : 'Log in'}
                                </Button>
                            </div>
                    </Box>
                </Grid>
            </Grid>
        </Layout>
    );
}
