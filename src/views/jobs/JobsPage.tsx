import { useEffect, useState } from "react";
import Layout from "../Layout";
import getJobs from "../../components/job/getJobs";
import { IJob } from "../../components/job/i-job.interface";
import JobsDataGrid from "./JobsDataGrid";
import './jobs.scss';
import getTagsJobsList from "../../components/tag/getTagsJobsList";
import getTagsJobsMap from "../../components/tag/getTagsJobsMap";
import getTags from "../../components/tag/getTags";
import { ITag } from "../../components/tag/i-tag.interface";
import Search from "../../components/search/Search";
import { Typography } from "@mui/material";
import processJobs from "../../components/job/processJobs";

export default function JobsPage(props: any) {
    const [allJobs, setAllJobs] = useState<IJob[]>([]);
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    function onSearchQueryChanged(searchQuery: string) {
        if (searchQuery.length > 0) {
            setSearchQuery(searchQuery);
            getJobsAndTags(searchQuery);
            setIsSearching(true);
        } else {
            getJobsAndTags();
            setIsSearching(false);
            setSearchQuery('');
        }
    }

    function getJobsAndTags(query?: string) {
        Promise.all([
            getJobs({ searchQuery: query }),
            getTags()
        ]).then((responses: any) => {
            const responseJobs: IJob[] = responses[0].data.results;
            const responseTags: ITag[] = responses[1].data.results;

            processJobs(responseJobs, responseTags).then((jobs: IJob[]) => {
                setAllJobs(jobs);
                setJobs(jobs);
            }).catch((error: any) => {
                console.error(error);
            });            
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        document.title = 'Jobs';
        getJobsAndTags();
    }, []);
    
    return (
        <>
            <Layout theme={props.theme} areaTitle="Jobs">
                <Search onSearchQueryChanged={onSearchQueryChanged} />
                {jobs.length > 0 && (
                    <JobsDataGrid jobs={jobs} searchQuery={searchQuery} />
                )}
                {!isSearching && jobs.length === 0 ? (
                    <span>Loading jobs...</span>
                ) : ''}
                {jobs.length === 0 && isSearching ? (
                    <Typography variant="body2" color="text.secondary">
                        No results for that query.
                    </Typography>
                ) : ''}
            </Layout>
        </>
    );
}