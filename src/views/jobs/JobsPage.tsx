import { useEffect, useState } from "react";
import Layout from "../Layout";
import getJobs from "../../components/job/getJobs";
import { IJob } from "../../components/job/i-job.interface";
import JobsDataGrid from "./JobsDataGrid";
import './jobs.scss';

export default function JobsPage(props: any) {
    const [jobs, setJobs] = useState<IJob[]>([]);

    useEffect(() => {
        document.title = 'Jobs';
        getJobs().then((response: any) => {
            const responseJobs: IJob[] = response.data.results;
            setJobs(responseJobs);
        }).catch((error: any) => {
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