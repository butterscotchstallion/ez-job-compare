import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import getJobCount from '../../components/job/getJobCount';
import JobsPerEmployerChart from '../charts/JobsPerEmployerChart';

export default function Dashboard() {
    const [jobsPerEmployerChart, setJobsPerEmployerChart] = useState<any>();

    useEffect(() => {
        document.title = 'Dashboard';
        setUpCharts();
    }, []);

    function setUpCharts() {
        Promise.all([
            getJobCount()
        ]).then((response: any) => {
            const chart = <JobsPerEmployerChart data={response[0].data.results} />;
            setJobsPerEmployerChart(chart);
        });
    }

    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={6}>
                <h4>Jobs by Employer</h4>
                {jobsPerEmployerChart}
            </Grid>
        </Grid> 
    );
}