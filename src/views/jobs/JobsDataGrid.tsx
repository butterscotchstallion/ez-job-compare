import { Badge, Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography, styled } from '@mui/material';
import { IJob } from '../../components/job/i-job.interface';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import ReactTimeAgo from 'react-time-ago'
import TagList from '../../components/tag/TagList';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#1A2027',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
}));

export default function JobsDataGrid(props: any) {
    const jobs = props.jobs.map((job: IJob) => {
        job.formattedDate = formatDate(job.createdAt);
        return job;
    });
    const showFullDescription = props.showFullDescription;

    return (
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    {jobs.map((job: IJob, index: number) => (
                        <Card
                            key={index}
                            className="jobs-list-item"
                            variant="outlined">
                            <CardHeader 
                                className="jobs-card-header"
                                title={
                                    <Link to={'/jobs/'+job.slug}>{job.title}</Link>
                                }
                                subheader={
                                    <>
                                        <Link to={'/employers/'+job.employerSlug}>{job.employerName}</Link> 
                                        {job.location && (
                                            <Typography variant="body2" color="text.secondary">
                                                {job.location}
                                            </Typography>
                                        )}
                                    </>
                                }
                                action={
                                    <>
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    </>
                                }
                            >
                            </CardHeader>
                            <CardContent className="jobs-card-content">
                                <Paper className="jobs-salary-range-area">
                                    <Typography variant="body2" color="text.secondary">
                                        Salary range: {job.salaryRangeStart} - {job.salaryRangeEnd}
                                    </Typography>
                                </Paper>
                                <TagList tags={job.tags} />
                                <Typography variant="body2" color="text.secondary">
                                    {showFullDescription ? job.longDescription : job.shortDescription}
                                </Typography>
                            </CardContent>

                            <CardActions className="jobs-card-actions">
                                <Typography variant="body2" color="text.secondary">
                                    Posted <ReactTimeAgo
                                                date={new Date(job.formattedDate)}
                                                locale="en-US"
                                                timeStyle="round"/>
                                </Typography>
                            </CardActions>
                        </Card>
                    ))}
                </Grid>
            </Grid>
    );
};