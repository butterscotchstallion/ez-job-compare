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

export default function JobsPage(props: any) {
    const [jobs, setJobs] = useState<IJob[]>([]);

    useEffect(() => {
        document.title = 'Jobs';
        Promise.all([
            getJobs(),
            getTags()
        ]).then((responses: any) => {
            const responseJobs: IJob[] = responses[0].data.results;
            const responseTags: ITag[] = responses[1].data.results;

            getTagsJobsList().then((tagsJobsMapResponse: any) => {
                const tagsJobsMap = getTagsJobsMap(tagsJobsMapResponse.data.results, responseTags);
                const jobsWithTags = responseJobs.map((j: any) => {
                    j.tags = tagsJobsMap[j.id] || [];
                    return j;
                });
                setJobs(jobsWithTags);
            });
        }).catch((error) => {
            console.error(error);
        });
    }, []);
    
    return (
        <>
            <Layout theme={props.theme} areaTitle="Jobs">
                {jobs.length > 0 ? (
                    <JobsDataGrid jobs={jobs} />
                ) : <p>Loading...</p>}
            </Layout>
        </>
    );
}