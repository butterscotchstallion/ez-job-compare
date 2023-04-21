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
    const [loading, setLoading] = useState(false);
    const [allJobs, setAllJobs] = useState<IJob[]>([]);
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [salaryRangeMin, setSalaryRangeMin] = useState(0);
    const [salaryRangeMax, setSalaryRangeMax] = useState(0);
    
    function onSearchQueryChanged(searchQuery: string) {
        if (searchQuery.length > 0) {
            setSearchQuery(searchQuery);
            getJobsAndTags(searchQuery);
            setIsSearching(true);
        } else {
            getJobsAndTags();
        }
    }

    function onSalaryRangeMinChanged(newValue: number) {
        setSalaryRangeMin(newValue);
    }

    function onSalaryRangeMaxChanged(newValue: number) {
        setSalaryRangeMax(newValue);
    }

    function getJobsAndTags(query?: string) {
        setLoading(true);
        Promise.all([
            getJobs({ 
                searchQuery: query,
                salaryRangeMin: salaryRangeMin,
                salaryRangeMax: salaryRangeMax
            }),
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
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        document.title = 'Jobs';
        getJobsAndTags();
    }, []);
    
    return (
        <Layout theme={props.theme} areaTitle="Jobs">
            <Search 
                onSearchQueryChanged={onSearchQueryChanged}
                onSalaryRangeMinChanged={onSalaryRangeMinChanged}
                onSalaryRangeMaxChanged={onSalaryRangeMaxChanged}
            />

            {jobs.length > 0 && (
                <JobsDataGrid   jobs={jobs}
                                searchQuery={searchQuery}
                                isSearching={isSearching}
                                salaryRangeMin={salaryRangeMin}
                                salaryRangeMax={salaryRangeMax} />
            )}
            {loading ? (
                <span>Loading jobs...</span>
            ) : ''}
            {jobs.length === 0 && isSearching ? (
                <Typography variant="body2" color="text.secondary">
                    No results for that query.
                </Typography>
            ) : ''}
        </Layout>
    );
}