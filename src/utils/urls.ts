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
        "jobsList": (searchQuery: string | undefined) => {
            let url = BASE_URL + 'jobs'; 
            if (searchQuery) { 
                url += '?query='+encodeURI(searchQuery);
            }
            return url;
        },
        "tagsJobs": BASE_URL + 'jobs/tagsMap',
        "jobCount": BASE_URL + 'employers/jobCount'
    };
};
export default URLS;