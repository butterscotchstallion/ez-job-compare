import { CircularProgress, Grid } from '@mui/material';
import { useGetJobCountsQuery } from '../../components/employer/employersSlice';
import { useEffect, useState } from 'react';
import JobsPerEmployerChart from '../charts/JobsPerEmployerChart';

export default function Dashboard() {
    const [jobsPerEmployer, setJobsPerEmployer] = useState<any>();
    const { data, error, isLoading } = useGetJobCountsQuery();

    useEffect(() => {
        if (!isLoading) {
            setJobsPerEmployer(<JobsPerEmployerChart data={data} />);
        }
    }, [isLoading]);   

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <h4>Jobs by Employer</h4>
                {isLoading ? <CircularProgress /> : ''}
                {jobsPerEmployer}
            </Grid>
            <Grid item xs={12}>
                <h4>Karma by User</h4>
                {isLoading ? <CircularProgress /> : ''}
                {/*karmaSummary*/}
            </Grid>
            <Grid item xs={12}>
                <h4>Reviews by Employer</h4>
                {isLoading ? <CircularProgress /> : ''}
                {/*reviewsByEmployer*/}
            </Grid>
        </Grid> 
    );
}