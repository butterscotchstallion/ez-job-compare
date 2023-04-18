import axios from 'axios';
import URLS from '../../utils/urls';

export default function getEmployer(id: number) {
    return axios.get(URLS().employer(id));
}