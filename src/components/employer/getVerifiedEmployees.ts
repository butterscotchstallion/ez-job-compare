import axios from 'axios';
import URLS from '../../utils/urls';

export default function getVerifiedEmployees(employerSlug: string) {
    return axios.get(URLS().verifiedEmployeesAPI(employerSlug));
};