import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import './login.scss';
import login from "../../components/user/login";
import { useNavigate } from "react-router-dom";
import URLS from "../../utils/urls";

export default function LoginPage(props: any) {
    const [loginError, setLoginError] = useState('');
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Log in';
    }, []);

    function onSubmit(e: any) {
        e.preventDefault();
        setButtonDisabled(true);
        setLoading(true);

        login(username, password).then((response: any) => {
            navigate(URLS().dashboard);
        }).catch((error: any) => {
            setLoginError(error.message);
        }).finally(() => {
            setLoading(false);
            setButtonDisabled(false);
        });
    }

    return (
        <Layout theme={props.theme} areaTitle="Login">
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
                                    onChange={(e) => setUsername(e.target.value)}
                                    />
                            </div>
                            <div>
                                <TextField
                                    required
                                    type="password"
                                    label="Password"
                                    onChange={(e) => setPassword(e.target.value)}
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
