import { CircularProgress, Grid } from '@mui/material';
import { useGetKarmaByUserQuery, useGetReviewsByEmployerQuery } from '../../components/charts/chartsSlice';
import { useGetJobCountsQuery } from '../../components/employer/employersSlice';
import JobsPerEmployerChart from '../charts/JobsPerEmployerChart';
import KarmaByUser from '../charts/KarmaByUser';
import ReviewsByEmployer from '../charts/ReviewsByEmployer';

export default function Dashboard() {
    const {data: jobCountData, isLoading: jobCountsLoading } = useGetJobCountsQuery();
    const {data: karmaData, isLoading: karmaLoading, isSuccess: karmaSucces, error: karmaError} = useGetKarmaByUserQuery();
    const {data: reviewsData, isLoading: reviewsLoading} = useGetReviewsByEmployerQuery();
    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <h4>Jobs by Employer</h4>
                {jobCountsLoading ? <CircularProgress /> : ''}
                <JobsPerEmployerChart data={jobCountData} />
            </Grid>
            <Grid item xs={12}>
                <h4>Karma by User</h4>
                {karmaLoading ? <CircularProgress /> : ''}
                {karmaError ? 'Error: '+(karmaError as any).message : ''}
                {karmaSucces ? (
                    <KarmaByUser data={karmaData} />
                ) : ''}
            </Grid>
            <Grid item xs={12}>
                <h4>Reviews by Employer</h4>
                {reviewsLoading ? <CircularProgress /> : ''}
                <ReviewsByEmployer data={reviewsData} />
            </Grid>
        </Grid> 
    );
}