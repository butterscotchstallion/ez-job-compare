import { CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import getJobCount from '../../components/job/getJobCount';
import getReviewsCountList from '../../components/reviews/getReviewsCountList';
import { getKarmaSummary } from '../../components/user/getKarma';
import JobsPerEmployerChart from '../charts/JobsPerEmployerChart';
import KarmaByUser from '../charts/KarmaByUser';
import ReviewsByEmployer from '../charts/ReviewsByEmployer';
import { useGetJobCountsQuery } from '../../components/employer/employersSlice';

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [jobsPerEmployer, setJobsPerEmployer] = useState<any>();
    const [karmaSummary, setKarmaSummary] = useState<any>();
    const [reviewsByEmployer, setReviewsByEmployer] = useState<any>();

    useEffect(() => {
        document.title = 'Dashboard';
        setUpCharts();
    }, []);

    function setUpCharts() {
        const { data, error, isLoading } = useGetJobCountsQuery();
        /*setLoading(true);
        Promise.all([
            getJobCount(),
            getKarmaSummary(),
            getReviewsCountList()
        ]).then((response: any) => {
            setJobsPerEmployer(<JobsPerEmployerChart data={response[0].data.results} />);
            setKarmaSummary(<KarmaByUser data={response[1].data.results} />);
            setReviewsByEmployer(<ReviewsByEmployer data={response[2].data.results} />);
        }, (error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });*/
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <h4>Jobs by Employer</h4>
                {loading ? <CircularProgress /> : ''}
                {jobsPerEmployer}
            </Grid>
            <Grid item xs={12}>
                <h4>Karma by User</h4>
                {loading ? <CircularProgress /> : ''}
                {karmaSummary}
            </Grid>
            <Grid item xs={12}>
                <h4>Reviews by Employer</h4>
                {loading ? <CircularProgress /> : ''}
                {reviewsByEmployer}
            </Grid>
        </Grid> 
    );
}