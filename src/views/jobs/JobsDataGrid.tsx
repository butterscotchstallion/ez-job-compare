import MoreVertIcon from '@mui/icons-material/MoreVert';
import PreviewIcon from '@mui/icons-material/Preview';
import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useEffect, useRef, useState } from 'react';
import Highlighter from "react-highlight-words";
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { IJob } from '../../components/job/i-job.interface';
import TagList from '../../components/tag/TagList';
import formatDate from '../../utils/formatDate';
import { IReview } from '../../components/reviews/i-review.interface';
import EmployerReview from '../reviews/EmployerReview';
import getReviewsByEmployerSlug from '../../components/reviews/getReviewsByEmployerSlug';
import IVerifiedEmployee from '../../components/employer/i-verified-employee.interface';
import getVerifiedEmployeesMap, { IVerifiedEmployeesMap } from '../../components/employer/getVerifiedEmployeesMap';
import getVerifiedEmployees from '../../components/employer/getVerifiedEmployees';
import AddIcon from '@mui/icons-material/Add';
import { getUser } from '../../components/user/userStorage';

export default function JobsDataGrid(props: any) {
    const isFilteringBySalary = props.isSearching && props.salaryRangeMin && props.salaryRangeMax;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const descriptionElementRef = useRef<HTMLElement>(null);
    const jobs = props.jobs.map((job: IJob) => {
        job.formattedDate = formatDate(job.createdAt);
        return job;
    });
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
    const [reviewEmployerName, setReviewEmployerName] = useState<string>('');
    const [reviewEmployerSlug, setReviewEmployerSlug] = useState<string>('');
    const [verifiedEmployeesMap, setVerifiedEmployeesMap] = useState<IVerifiedEmployeesMap>({});
    const user = getUser();

    useEffect(() => {
        if (isOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, []);

    function onClose() {
        setIsOpen(false);
    }

    function onReviewButtonClicked(job: IJob) {
        setReviewEmployerName(job.employerName);
        setReviewEmployerSlug(job.employerSlug);
        setLoadingReviews(true);
        getReviewsByEmployerSlug(job.employerSlug).then((response: any) => {
            setReviews(response.data.results);
        }, (error) => {
            console.error(error);
        }).finally(() => {
            setLoadingReviews(false);
        });
        getVerifiedEmployees(job.employerSlug).then((response: any) => {
            setVerifiedEmployeesMap(getVerifiedEmployeesMap(response.data.results));
        }, (error) => {
            console.error(error);
        });
        setIsOpen(true);
    }

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
                                <div className="jobs-header-action-area">
                                    {user ? (
                                        <Button 
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                        >Add Review</Button>
                                    ) : ''}

                                    <Button variant="outlined"
                                            onClick={() => onReviewButtonClicked(job)}
                                            className="see-reviews-button"
                                            startIcon={<PreviewIcon />}
                                            disabled={job.reviewCount === 0}>
                                        {job.reviewCount} Review{job.reviewCount !== 1 ? 's' : ''}
                                    </Button>
                                  
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                </div>
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

                <Dialog
                    open={isOpen}
                    onClose={onClose}
                    scroll="paper"
                    fullWidth={true}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    className="employer-reviews-dialog"
                >
                    <DialogTitle id="scroll-dialog-title">{reviewEmployerName} Reviews</DialogTitle>
                    <DialogContent dividers={true}>
                        {loadingReviews ? (
                            <CircularProgress />
                        ) : reviews.map((review: IReview, index: number) => (
                            <EmployerReview 
                                review={review}
                                userId={review.reviewAuthorUserId}
                                verifiedEmployeesMap={verifiedEmployeesMap}
                                key={index} 
                            />
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Grid>
    );
};