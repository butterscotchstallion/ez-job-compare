import { Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { IJob } from '../../components/job/i-job.interface';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import ReactTimeAgo from 'react-time-ago'
import TagList from '../../components/tag/TagList';
import Highlighter from "react-highlight-words";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
                                <Link to={job.employerWebsite} title="Employer website" target="_blank">
                                    <Highlighter
                                        searchWords={[props.searchQuery]}
                                        autoEscape={true}
                                        textToHighlight={job.employerName}
                                    />
                                </Link>
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
                            <Grid container>
                                <Grid item xs={6}>
                                    <div className="job-desc-wrapper">
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
                                    </div>                                
                                </Grid>
                                <Grid item xs={6}>
                                    <TableContainer component={Paper}>
                                        <Table size="small" aria-label="Job Information" className="job-info-table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="job-table-left-col">
                                                        Salary Range
                                                    </TableCell>
                                                    <TableCell>
                                                        {isFilteringBySalary ? (
                                                                <mark>{job.salaryRangeStart} - {job.salaryRangeEnd}</mark>
                                                            ) : 
                                                                <>{job.salaryRangeStart} - {job.salaryRangeEnd}</>
                                                        }
                                                    </TableCell>
                                                </TableRow>                                                
                                                {job.location ? (
                                                    <TableRow>
                                                        <TableCell>Location</TableCell>
                                                        <TableCell>
                                                            <Highlighter
                                                                searchWords={[props.searchQuery]}
                                                                autoEscape={true}
                                                                textToHighlight={job.location}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : ''}
                                                <TableRow>
                                                    <TableCell className="job-table-left-col">
                                                        Company size
                                                    </TableCell>
                                                    <TableCell>
                                                        {job.companySize}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="job-table-left-col">
                                                        Reviews
                                                    </TableCell>
                                                    <TableCell>
                                                        {job.reviewCount > 0 ? (
                                                            <>
                                                                {job.reviewCount} review
                                                                {job.reviewCount !== 1 ? 's' : ''}
                                                            </>
                                                        ) : (
                                                            <>0 reviews</>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                {job.tags.length ? (
                                                    <TableRow>
                                                        <TableCell className="job-table-left-col">Tags</TableCell>
                                                        <TableCell>
                                                            <TagList tags={job.tags} />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : ''}                                   
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
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