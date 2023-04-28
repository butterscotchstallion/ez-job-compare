import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ShareIcon from '@mui/icons-material/Share';
import { Alert, Avatar, Badge, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Switch, TextField, Tooltip, Typography } from "@mui/material";
import { filter, find } from "lodash";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import getEmployers from "../../components/employer/getEmployers";
import getEmployersRecruitersMap from "../../components/employer/getEmployersRecruitersMap";
import getRecruiters from "../../components/employer/getRecruiters";
import IEmployer from "../../components/employer/i-employer.interface";
import addJob from "../../components/job/addJob";
import getJobCountMap from "../../components/job/getJobCountMap";
import { IJob } from "../../components/job/i-job.interface";
import SalaryRangeSlider from "../../components/search/SalaryRangeSlider";
import TagFilterList from "../../components/tag/TagFilterList";
import TagList from "../../components/tag/TagList";
import getTagSlugMap from "../../components/tag/getTagSlugMap";
import getTags from "../../components/tag/getTags";
import getTagsEmployersList from "../../components/tag/getTagsEmployersList";
import getTagsEmployersMap from "../../components/tag/getTagsEmployersMap";
import { ITag } from "../../components/tag/i-tag.interface";
import { canPostJobs, isVerifier } from "../../components/user/getUserRoles";
import { getUser } from "../../components/user/userStorage";
import Layout from "../Layout";
import UserAutocomplete from '../user/UserAutocomplete';
import { IVerifyUser } from '../../components/user/i-verify-user.interface';
import IUser from '../../components/user/i-user.interface';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import './employer.scss';
import '../../styles/form.scss';
import { DateField } from '@mui/x-date-pickers';

export default function EmployerListPage(props: any) {
    const [employers, setEmployers]: any = useState([]);
    const [tags, setTags]: any = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMessage] = useState('');
    const [filterSlugName, setFilterSlugName] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [verifyUserPayload, setVerifyUserPayload] = useState<IVerifyUser | any>({});
    const [selectedEmployer, setSelectedEmployer] = useState<IEmployer>();
    const [selectedUser, setSelectedUser] = useState<IUser>();
    const [job, setJob] = useState<IJob>({
        id: 0,
        employerId: 0,
        title: '',
        shortDescription: '',
        longDescription: '',
        salaryRangeStart: 0,
        salaryRangeEnd: 0,
        employerName: '',
        employerSlug: '',
        employerWebsite: '',
        slug: '',
        formattedDate: '',
        formattedDateRelative: '',
        companySize: '',
        reviewCount: 0,
        location: '',
        createdAt: '',
        updatedAt: '',
        tags: []
    });
    const isSettingsMenuOpen = !!anchorEl;
    const {tagSlug} = useParams();
    const user = getUser();
    let isFiltering = tagSlug && tagSlug.length > 0;

    useEffect(() => {
        let mounted = true;
        console.log('Rendering!');
        document.title = 'Employer List';

        if (mounted) {
            setLoading(true);
            Promise.all([
                getEmployers(),
                getTags(),
                getJobCountMap(),
                getRecruiters()
            ]).then((response: any) => {
                // Employers - populate tags initially
                let employersResults = response[0].data.results.map((e: any) => {
                    e.tags = [];
                    return e;
                });
                if (tagSlug) {
                    const filtered = filterByTagSlug(employersResults, tagSlug);
                    setEmployers(filtered);
                } else {
                    setEmployers(employersResults);
                    setFilterSlugName('');
                }

                // Tags
                const tagResults = response[1].data.results;
                if (tagResults.length > 0) {
                    setTags(tagResults);

                    getTagsEmployersList().then((tagsEmployersResponse: any) => {
                        // Employer Tags
                        const tagsEmployersMap = getTagsEmployersMap(tagsEmployersResponse.data.results, tagResults);
                        const employersWithTags = employersResults.map((e: any) => {
                            e.tags = tagsEmployersMap[e.id] || [];
                            return e;
                        });
                        // Job counts
                        const employersWithCounts = employersWithTags.map((e: IEmployer) => {
                            e.jobCount = response[2][e.id];
                            e.jobCountTitle = e.jobCount + (e.jobCount === 1 ? ' job' : ' jobs');
                            return e;
                        });
                        // Employers/users map
                        const employersUsersMap = getEmployersRecruitersMap(response[3].data.results);
                        const employersWithUsers = employersWithCounts.map((e: IEmployer) => {
                            e.userIds = [];
                            if (typeof employersUsersMap[e.id] !== 'undefined') {
                                e.userIds = employersUsersMap[e.id];
                            }
                            return e;
                        });
                        setEmployers(employersWithUsers);
                    });
                    
                    if (isFiltering) {
                        const tagSlugMap = getTagSlugMap(tags);
                        const tag: ITag = isFiltering ? tagSlugMap[(tagSlug || '')] : null;
                        if (tag) {
                            console.log('setting filter slug to '+tag.name);
                            setFilterSlugName(tag.name);
                        } else {
                            console.warn(tagSlug + ' not in tag map: '+tagSlugMap);
                        }
                    }
                }

                setErrorMsg('');
                setLoading(false);
            })
            .catch((error: any) => {
                setErrorMsg(error.message);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });
        }

        return function cleanup() {
            mounted = false;
        };        
    }, []);
    
    function filterByTagSlug(employers: any[], filterSlug: string | undefined) {
        let filtered = employers;

        if (filterSlug) {
            filtered = filter(employers, (e: any) => {
                return find(e.tags, (t: any) => {
                    return t.slug === filterSlug;
                });
            });
        }

        return filtered;
    }

    function onClose() {
        setAnchorEl(null);
    }

    function onPostJobClicked(employer: IEmployer) {
        job.employerId = employer.id;
        job.employerName = employer.name;
        setJob(job);
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
        setIsVerifyModalOpen(false);
    }

    function handlePost(e: any) {
        e.preventDefault();
        setLoading(true);
        addJob(job).then((response: any) => {
            if (response.data.status === 'OK') {
                setSuccessMessage('Job posted!');
                handleClose();
            } else {
                setErrorMsg('Something went wrong.');
            }
        }, (error: any) => {
            setErrorMsg(error.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    function handleChange(field: any, e: any) {
        job[field] = e.target.value;
        setJob(job);

        const isFormValid = isNewJobValid();
        if (isFormValid) {
            setSubmitDisabled(false);
        }
    }

    function onSalaryRangeChanged(range: number[]) {
        job.salaryRangeStart = range[0];
        job.salaryRangeEnd = range[1];
        setJob(job);
    }

    function isNewJobValid() {
        const titleValid = job.title.trim().length > 0;
        const shortDescValid = job.shortDescription.trim().length > 0;
        const salaryStartValid = job.salaryRangeStart> 0;
        const salaryEndValid = job.salaryRangeEnd > 0;
        return titleValid && shortDescValid && salaryStartValid && salaryEndValid;
    }

    function isRecruiterAndCanPostJobs(recruiterIds: number[]) {
        if (user) {
            const isRecruiter = recruiterIds.indexOf(user.id) !== -1;
            const hasRecruiterRole = canPostJobs();
            return isRecruiter && hasRecruiterRole;
        }
    }

    function onVerifySubmitted(e: any) {
        e.preventDefault();
    }

    function onEmployerSettingsClicked(event: React.MouseEvent<HTMLButtonElement>, employer: IEmployer) {
        setAnchorEl(event.currentTarget);
        setSelectedEmployer(employer);
    }

    function onUserChanged(e: any, user: IUser) {
        setSelectedUser(user);
        verifyUserPayload.userId = user.id;
        verifyUserPayload.employerId = selectedEmployer?.id;
        verifyUserPayload.employerSlug = selectedEmployer?.slug;
        
        if (isVerificationValid()) {
            setVerifyUserPayload(verifyUserPayload);
            setSubmitDisabled(false);
        }
    }

    function isVerificationValid() {
        const validUserId = verifyUserPayload.userId;
        const validEmployerId = verifyUserPayload.employerId;
        const validEmployerSlug = verifyUserPayload.employerSlug;

        // TODO: validate end date if entered here
        return validUserId && validEmployerId && validEmployerSlug;
    }

    function onVerifyDateChanged(day: any, field: string) {
        const formattedDate = day.format('YYYY-MM-DD');
        verifyUserPayload[field] = formattedDate;

        if (isVerificationValid()) {
            setSubmitDisabled(false);
        }
    }

    function onVerifyMenuClicked() {
        setIsVerifyModalOpen(true);
        onClose();
    }

    return (
        <>  
            <Layout theme={props.theme} areaTitle="Employer List">
                <Grid container>
                    <Grid item xs={12} rowSpacing={2}>
                        {loading ? <CircularProgress /> : ''}
                
                        {isFiltering && employers && employers.length === 0 ? (
                            <p>No results using that filter</p>
                        ) : null}

                        {errorMsg ? (
                            <Alert severity="error">{errorMsg}</Alert>
                        ) : ''}
                        {successMsg ? (
                            <Alert severity="success">{successMsg}</Alert>
                        ) : ''}
                    </Grid>
                </Grid>

                <Dialog 
                    open={isOpen}
                    onClose={handleClose}
                    scroll="paper"
                    fullWidth={true}
                    className="post-new-job-dialog">
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' }
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handlePost}
                        >
                        <DialogTitle>Post Job for {job.employerName}</DialogTitle>
                        <DialogContent>
                            {errorMsg ? (
                                <Alert severity="error">{errorMsg}</Alert>
                            ) : ''}
                            <Grid container>
                                <Grid item xs={6}>
                                    <div>
                                        <TextField
                                            id="outlined-error"
                                            label="Title"
                                            required
                                            fullWidth
                                            onChange={(e) => handleChange('title', e)}
                                            />
                                    </div>
                                    <div>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Short description"
                                            multiline
                                            className="new-job-post-descriptions"
                                            rows={4}
                                            required
                                            fullWidth
                                            onChange={(e) => handleChange('shortDescription', e)}
                                            />
                                    </div>
                                    <div>
                                        <TextField
                                            id="outlined-error"
                                            label="Location"
                                            fullWidth
                                            onChange={(e) => handleChange('location', e)}
                                            />
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>
                                        <label>Salary range</label>
                                        <SalaryRangeSlider onChange={onSalaryRangeChanged} />
                                    </div>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} variant="outlined">Cancel</Button>
                            <Button 
                                onClick={handlePost}
                                disabled={submitDisabled}
                                variant="outlined">Post</Button>
                        </DialogActions>
                    </Box>
                </Dialog>

                <Dialog 
                    open={isVerifyModalOpen}
                    onClose={handleClose}
                    scroll="paper"
                    fullWidth={true}
                    className="verify-dialog">
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        onSubmit={onVerifySubmitted}
                        >
                        <DialogTitle>Verification status</DialogTitle>
                        <DialogContent className="verify-dialog-content">                            
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    {errorMsg ? (
                                        <Alert severity="error">{errorMsg}</Alert>
                                    ) : ''}
                                    <div className="autocomplete-wrapper">
                                        <UserAutocomplete 
                                            onChange={onUserChanged}
                                            employerSlug={selectedEmployer?.slug}
                                            />
                                    </div>
                                    <FormControlLabel
                                        value="top"
                                        control={(
                                            <Switch 
                                                color="primary"
                                                checked={!!selectedUser?.verified}
                                                />
                                        )}
                                        label="Verified"
                                        labelPlacement="top"
                                        />
                                </Grid>
                                <Grid item xs={6}>
                                    <div className="form-area">
                                        <DateField 
                                            label="Start Date*"
                                            value={selectedUser?.startDate}
                                            onChange={(e: any) => onVerifyDateChanged(e, 'startDate')}
                                            format="LL"
                                        />
                                    </div>
                                    <div>
                                        <DateField 
                                            label="End Date"
                                            value={selectedUser?.endDate}
                                            onChange={(e: any) => onVerifyDateChanged(e, 'endDate')}
                                            format="LL"
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} variant="outlined">Cancel</Button>
                            <Button 
                                type="submit"
                                disabled={submitDisabled}
                                variant="outlined">Save</Button>
                        </DialogActions>
                    </Box>
                </Dialog>

                {employers ? (
                    <>                    
                        {filterSlugName ? (
                            <Card className="employerListFilterMessage" variant="outlined">
                                <CardContent>Filtering by {filterSlugName}</CardContent>
                            </Card>
                        ) : ''}

                        {tags ? (
                            <TagFilterList props={{ tags: tags }} />
                        ) : ''}

                        <Grid container spacing={3}>
                            {employers.map((employer: any, index: number) => (
                                <Grid item xs={4} key={index}>
                                    <Card
                                        variant="outlined"
                                        className="employer-list-page-card"    
                                        >
                                        <CardHeader
                                            avatar={
                                                <Avatar sx={{ bgcolor: '#ccc' }} aria-label="recipe">
                                                    <Link className="avatar-link" to={'/employers/'+employer.id}>{employer.name[0]}</Link>
                                                </Avatar>
                                            }
                                            action={
                                                <> 
                                                    {employer.jobCount > 0 ? (
                                                        <Tooltip title={employer.jobCountTitle} arrow>
                                                            <Badge
                                                                badgeContent={employer.jobCount}
                                                                className="employer-list-job-count-badge"
                                                                color="primary"
                                                            >
                                                                <AccountBoxIcon />
                                                            </Badge>
                                                        </Tooltip>
                                                    ) : ''}
                                                    
                                                    <IconButton 
                                                        aria-label="settings"
                                                        onClick={(e) => onEmployerSettingsClicked(e, employer)}
                                                        >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        open={isSettingsMenuOpen}
                                                        onClose={onClose}
                                                        anchorEl={anchorEl}
                                                        >
                                                        <MenuList autoFocusItem={isSettingsMenuOpen}>
                                                            {isVerifier() ? (
                                                                <MenuItem onClick={onVerifyMenuClicked}>
                                                                    <ListItemIcon>
                                                                        <AddBoxIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText>Verify employee</ListItemText>
                                                                </MenuItem>
                                                            ) : ''}                                                            
                                                            {isRecruiterAndCanPostJobs((employer?.userIds || [])) ? (
                                                                <MenuItem onClick={() => onPostJobClicked(employer) }>
                                                                    <ListItemIcon>
                                                                    <NewspaperIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText>Post Job</ListItemText>
                                                                </MenuItem>
                                                            ): ''}                                                
                                                        </MenuList>
                                                    </Menu>
                                                </>
                                            }
                                            title={
                                                <Link to={'/employers/'+employer.id}>{employer.name}</Link>
                                            }
                                            subheader={employer.type}
                                        />
                                        <CardMedia
                                            sx={{ height: 200 }}
                                            image={'/images/'+employer.image}
                                            title={employer.name}
                                        />
                                        <CardContent>
                                            {employer.tags.length > 0 && (
                                                <TagList tags={employer.tags} />
                                            )}
                                            <Typography variant="body2" color="text.secondary">
                                                {employer.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            <IconButton aria-label="add to favorites">
                                                <FavoriteIcon />
                                            </IconButton>
                                            <IconButton aria-label="share">
                                                <ShareIcon />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : ''}
            </Layout>
        </>
    );
};