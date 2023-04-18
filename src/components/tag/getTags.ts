import axios from 'axios';
import URLS from '../../utils/urls';

export default function getTags() {
    return axios.get(URLS().tagList);
}