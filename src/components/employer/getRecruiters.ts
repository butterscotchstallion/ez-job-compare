import axios from "axios";
import URLS from "../../utils/urls";
import { getToken } from "../user/token";

export interface IRecruitersList {
    userId: number;
    employerId: number;
};

export default function getRecruiters() {
    const token = getToken();
    return axios.get(URLS().recruitersAPI, {
        headers: {
            'Content-Type': 'application/json',
            'x-ezjobcompare-session-token': token
        }
    });
};