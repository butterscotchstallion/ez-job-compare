import axios from 'axios';
import URLS from '../../utils/urls';

export default function getEmployer(slug: string) {
    return axios.get(URLS().employer(slug));
}