import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import getJobCount from '../../components/job/getJobCount';
import JobsPerEmployerChart from '../charts/JobsPerEmployerChart';
import { getKarmaSummary } from '../../components/user/getKarma';
import KarmaByUser from '../charts/KarmaByUser';

export default function Dashboard() {
    const [jobsPerEmployer, setJobsPerEmployer] = useState<any>();
    const [karmaSummary, setKarmaSummary] = useState<any>();

    useEffect(() => {
        document.title = 'Dashboard';
        setUpCharts();
    }, []);

    function setUpCharts() {
        Promise.all([
            getJobCount(),
            getKarmaSummary()
        ]).then((response: any) => {
            setJobsPerEmployer(<JobsPerEmployerChart data={response[0].data.results} />);
            setKarmaSummary(<KarmaByUser data={response[1].data.results} />);
        });
    }

    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12}>
                <h4>Jobs by Employer</h4>
                {jobsPerEmployer}
            </Grid>
            <Grid item xs={12}>
                <h4>Karma by User</h4>
                {karmaSummary}
            </Grid>
        </Grid> 
    );
}