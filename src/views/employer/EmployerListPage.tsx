import { useEffect, useState } from "react";
import getEmployers from "../../components/employer/getEmployers";
import Layout from "../Layout";
import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Link, useParams } from "react-router-dom";
import './employer.scss';
import TagList from "../../components/tag/TagList";
import { filter, find } from "lodash";
import getTags from "../../components/tag/getTags";
import getTagSlugMap from "../../components/tag/getTagSlugMap";
import { ITag } from "../../components/tag/i-tag.interface";
import TagFilterList from "../../components/tag/TagFilterList";
import getTagsEmployersMap from "../../components/tag/getTagsEmployersMap";
import getTagsEmployersList from "../../components/tag/getTagsEmployersList";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import getJobCountMap from "../../components/job/getJobCountMap";
import IEmployer from "../../components/employer/i-employer.interface";

export default function EmployerListPage(props: any) {
    const [employers, setEmployers]: any = useState([]);
    const [tags, setTags]: any = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [filterSlugName, setFilterSlugName] = useState('');
    const {tagSlug} = useParams();
    let isFiltering = tagSlug && tagSlug.length > 0;

    useEffect(() => {
        let mounted = true;
        console.log('Rendering!');
        document.title = 'Employer List';

        if (mounted) {
            Promise.all([
                getEmployers(),
                getTags(),
                getJobCountMap()
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
                        const tagsEmployersMap = getTagsEmployersMap(tagsEmployersResponse.data.results, tagResults);
                        const employersWithTags = employersResults.map((e: any) => {
                            e.tags = tagsEmployersMap[e.id] || [];
                            return e;
                        });
                        const employersWithCounts = employersWithTags.map((e: IEmployer) => {
                            e.jobCount = response[2][e.id];
                            e.jobCountTitle = e.jobCount + (e.jobCount === 1 ? ' job' : ' jobs');
                            return e;
                        });
                        setEmployers(employersWithCounts);
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

    return (
        <>
            {isFiltering && employers && employers.length === 0 ? (
                <p>No results using that filter</p>
            ) : null}
            {employers ? (
                <Layout theme={props.theme} areaTitle="Employer List">
                    {filterSlugName && (
                        <Card className="employerListFilterMessage" variant="outlined">
                            <CardContent>Filtering by {filterSlugName}</CardContent>
                        </Card>
                    )}

                    {tags && (
                        <TagFilterList props={{ tags: tags }} />
                    )}

                    <Grid container spacing={3}>
                        {errorMsg && <p>Error! {errorMsg}</p>}

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
                                                            color="primary"
                                                        >
                                                            <AccountBoxIcon />
                                                        </Badge>
                                                    </Tooltip>
                                                ) : ''}
                                                
                                                <IconButton aria-label="settings">
                                                    <MoreVertIcon />
                                                </IconButton>
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
                </Layout>
            ) : <p>Loading...</p>}
        </>
    );
};