import axios from "axios";
import URLS from "../../utils/urls";
import { IJob } from "./i-job.interface";

export default function addJob(job: IJob) {
    return axios.post(
        URLS().addJobAPI,
        job
    );
};