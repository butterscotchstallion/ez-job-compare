import { Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, styled } from '@mui/material';
import { IJob } from '../../components/job/i-job.interface';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
                                <Card
                                    variant="outlined">
                                    <CardHeader 
                                        className="jobs-card-header"
                                        title={job.title}
                                        action={
                                            <IconButton aria-label="settings">
                                              <MoreVertIcon />
                                            </IconButton>
                                        }
                                    >
                                    </CardHeader>
                                    <CardContent className="jobs-card-content">
                                        <p>{job.shortDescription}</p>
                                    </CardContent>

                                    <CardActions className="jobs-card-actions">
                                        Posted on {job.createdAt}
                                    </CardActions>
                                </Card>
                            </Item>
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};