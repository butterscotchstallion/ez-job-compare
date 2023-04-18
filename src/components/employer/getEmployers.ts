import axios from 'axios';
import URLS from '../../utils/urls';

export default function getEmployer() {
    return axios.get(URLS().employers);
}