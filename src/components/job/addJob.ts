import axios from "axios";
import URLS from "../../utils/urls";
import { getToken } from "../user/token";
import { IJob } from "./i-job.interface";

export default function addJob(job: IJob) {
    const token = getToken();
    return axios.post(
        URLS().addJobAPI,
        job,
        {
            headers: {
                'Content-Type': 'application/json',
                'x-ezjobcompare-session-token': token
            }
        }
    );
};