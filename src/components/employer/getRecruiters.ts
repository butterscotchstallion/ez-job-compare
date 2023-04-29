import axios from "axios";
import URLS from "../../utils/urls";

export interface IRecruitersList {
    userId: number;
    employerId: number;
};

export default function getRecruiters() {
    return axios.get(URLS().recruitersAPI);
};