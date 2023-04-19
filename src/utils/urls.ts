const URLS = () => {
    const BASE_URL = 'http://localhost:5000/api/v1/';

    return {
        "employers": BASE_URL + 'employers',
        "employer": (id: number) => {
            return BASE_URL + 'data/employer.json';
        },
        "employerPage": (id: number) => {
            return BASE_URL + 'employers/'+id;
        },
        "tagList": BASE_URL + 'tags',
        "tagsEmployers": BASE_URL + 'employers/tagsMap',
        "jobsList": BASE_URL + 'jobs'
    };
};
export default URLS;