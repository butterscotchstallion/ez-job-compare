import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PreviewIcon from '@mui/icons-material/Preview';
import { Alert, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextareaAutosize, Typography } from '@mui/material';
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
import getVerifiedEmployees from '../../components/employer/getVerifiedEmployees';
import getVerifiedEmployeesMap, { IVerifiedEmployeesMap } from '../../components/employer/getVerifiedEmployeesMap';
import { IJob } from '../../components/job/i-job.interface';
import addReview from '../../components/reviews/addReview';
import getReviewsByEmployerSlug from '../../components/reviews/getReviewsByEmployerSlug';
import { IReview } from '../../components/reviews/i-review.interface';
import TagList from '../../components/tag/TagList';
import { canPostReviews } from '../../components/user/getUserRoles';
import { getUser } from '../../components/user/userStorage';
import formatDate from '../../utils/formatDate';
import EmployerReview from '../reviews/EmployerReview';

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
    const [reviewEmployerId, setReviewEmployerId] = useState<number | null>(null);
    const [verifiedEmployeesMap, setVerifiedEmployeesMap] = useState<IVerifiedEmployeesMap>({});
    const [isAddReviewModalOpen, setisAddReviewModalOpen] = useState<boolean>(false);
    const [reviewBody, setReviewBody] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [reviewFormValid, setReviewFormValid] = useState<boolean>(false);
    const [addReviewError, setAddReviewError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, []);

    // Review submitted
    function onSubmit(e: any) {
        e.preventDefault();
        setLoading(true);
        addReview(reviewEmployerId, reviewBody).then((response: any) => {
            if (response.data.status === 'OK') {
                onClose();
                setReviewBody('');
                setReviewEmployerId(null);
                setReviewFormValid(false);
                setReviewEmployerName('');
                setReviewEmployerSlug('');
                setAddReviewError('');
                console.log('Reloading jobs');
                props.onReviewSubmitted();
            } else {
                setAddReviewError(response.data.message);
            }            
        }, (error: any) => {
            setAddReviewError(error.message)
        }).finally(() => {
            setLoading(false);
        });
    }

    function updateBody(body: string) {
        const trimmedBody = body.trim();
        if (trimmedBody.length > 0) {
            setReviewBody(trimmedBody);
            setReviewFormValid(true);
        } else {
            setReviewFormValid(false);
        }
    }

    function onClose() {
        setIsOpen(false);
        setisAddReviewModalOpen(false);
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

    function onAddReviewButtonClicked(job: IJob) {
        setisAddReviewModalOpen(true);
        setReviewEmployerName(job.employerName);
        setReviewEmployerId(job.employerId);
    }

    function canPost() {
        return canPostReviews();
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
                                <Link to={'/employers/'+job.employerSlug} title="Employer page">
                                    <Highlighter
                                        searchWords={[props.searchQuery]}
                                        autoEscape={true}
                                        textToHighlight={job.employerName}
                                    />
                                </Link>
                            }
                            action={
                                <div className="jobs-header-action-area">
                                    {canPost() ? (
                                        <Button 
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={() => { onAddReviewButtonClicked(job) }}
                                        >
                                            Add Review
                                        </Button>
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
                                                                <mark>{job.salaryRangeStartFormatted} - {job.salaryRangeEndFormatted}</mark>
                                                            ) : 
                                                                <>{job.salaryRangeStartFormatted} - {job.salaryRangeEndFormatted}</>
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
                                                        Website
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link to={job.employerWebsite} target="_blank">
                                                            {job.employerWebsite}
                                                        </Link>
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

                <Dialog
                    open={isAddReviewModalOpen}
                    onClose={onClose}
                    scroll="paper"
                    fullWidth={true}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    className="employer-add-review-dialog"
                >
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={onSubmit}
                        >
                        <DialogTitle id="scroll-dialog-title">Add review for {reviewEmployerName}</DialogTitle>
                        <DialogContent dividers={true}>
                            {addReviewError ? (
                                <Alert severity="error">{addReviewError}</Alert>
                            ) : ''}
                            <div>
                                <div><label>Review text</label></div>
                                <TextareaAutosize
                                    className='new-review-body'
                                    aria-label="Review text"
                                    minRows={4}
                                    placeholder="Review text"
                                    required
                                    onChange={(e: any) => updateBody(e.target.value)}
                                />
                            </div>                          
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={onClose}
                                type="button">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="login-button"
                                disabled={loading || !reviewFormValid}
                                variant="outlined">
                                    {loading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            </Grid>
        </Grid>
    );
};