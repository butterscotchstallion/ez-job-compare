import { useEffect, useState } from "react";
import getEmployer from "../../components/employer/getEmployer";
import { redirect, useParams } from "react-router-dom";
import Layout from "../Layout";
import { Box, Typography } from "@mui/material";

export default function EmployerPage(props: any) {
    const [employer, setEmployer]: any = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    let {employerId} = useParams();

    useEffect(() => {
        document.title = 'Employer Info';
        if (employerId) {
            const numEmployerId = parseInt(employerId, 10);
            getEmployer(numEmployerId).then((response: any) => {
                setEmployer(response.data.results[0]);
                setErrorMsg('');
                setLoading(false);
            })
            .catch((error: any) => {
                setErrorMsg(error.message);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            redirect('/employers');
        }
    }, [employerId]);

    return (
        <>
            {loading && <p>Loading...</p>}
            {errorMsg && <p>Error! {errorMsg}</p>}
            {employer && (
                <Layout theme={props.theme} areaTitle="Employer Info">
                    <Box
                        component="section"
                        sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'auto',
                        }}
                        >
                        <Typography
                            component="h4"
                            variant="h4"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            {employer.name}
                        </Typography>
                    </Box>
                </Layout>
            )}
        </>
    );
};