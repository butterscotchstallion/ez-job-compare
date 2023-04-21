import { Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { IJob } from '../../components/job/i-job.interface';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import ReactTimeAgo from 'react-time-ago'
import TagList from '../../components/tag/TagList';
import Highlighter from "react-highlight-words";

export default function JobsDataGrid(props: any) {
    const isFilteringBySalary = props.isSearching && props.salaryRangeMin && props.salaryRangeMax;
    const jobs = props.jobs.map((job: IJob) => {
        job.formattedDate = formatDate(job.createdAt);
        return job;
    });
    return (
        <Grid container spacing={3}>
            <Grid item xs={8}>
                {jobs.map((job: IJob, index: number) => (
                    <Card
                        key={index}
                        className="jobs-list-item"
                        variant="outlined">
                        <CardHeader 
                            className="jobs-card-header"
                            title={
                                <Link to={'/jobs/'+job.slug}>
                                    <Highlighter
                                        searchWords={[props.searchQuery]}
                                        autoEscape={true}
                                        textToHighlight={job.title}
                                    />
                                </Link>
                            }
                            subheader={
                                <>
                                    <Link to={'/employers/'+job.employerSlug}>
                                        <Highlighter
                                            searchWords={[props.searchQuery]}
                                            autoEscape={true}
                                            textToHighlight={job.employerName}
                                        />
                                    </Link>
                                    {job.location && (
                                        <Typography variant="body2" color="text.secondary">
                                            <Highlighter
                                                searchWords={[props.searchQuery]}
                                                autoEscape={true}
                                                textToHighlight={job.location}
                                            />
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
                                    Salary range: 
                                    {isFilteringBySalary ? (
                                        <mark>{job.salaryRangeStart} - {job.salaryRangeEnd}</mark>
                                    ) : 
                                        <>{job.salaryRangeStart} - {job.salaryRangeEnd}</>
                                    }
                                </Typography>
                            </Paper>
                            <TagList tags={job.tags} />
                            <Typography variant="body2" color="text.secondary">
                                {
                                    props.showFullDescription ? (
                                        <Highlighter
                                            searchWords={[props.searchQuery]}
                                            autoEscape={true}
                                            textToHighlight={job.longDescription}
                                        /> 
                                    ) : (
                                        <Highlighter
                                            searchWords={[props.searchQuery]}
                                            autoEscape={true}
                                            textToHighlight={job.shortDescription}
                                        />
                                    )
                                }
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