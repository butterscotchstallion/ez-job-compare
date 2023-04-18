import axios from "axios";
import URLS from "../../utils/urls";

export default function getTagsEmployersList() {
    return new Promise((resolve, reject) => {
        axios.get(URLS().tagsEmployers).then((response: any) => {
            resolve(response.data);
        }, reject);
    });
};