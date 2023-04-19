import { Box, Grid, styled } from '@mui/material';
import { IJob } from '../../components/job/i-job.interface';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#1A2027',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

export default function JobsDataGrid(props: any) {
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Stack spacing={2}>
                        {props.jobs.map((job: IJob, index: number) => (
                            <Item key={index} className="jobs-list-item">
                                <h4>{job.title}</h4>
                                <p><small>Added {job.createdAt}</small></p>
                                <p>{job.description}</p>
                            </Item>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};