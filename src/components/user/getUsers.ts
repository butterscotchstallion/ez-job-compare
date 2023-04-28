import axios from "axios";
import URLS from "../../utils/urls";

export default function getUsers() {
    return axios.get(URLS().usersAPI);
}