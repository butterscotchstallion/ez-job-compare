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
        "jobsList": (props: any) => {
            const params: string[] = [];
            let url = BASE_URL + 'jobs'; 
            if (props.searchQuery) { 
                params.push('query='+encodeURI(props.searchQuery));
            }
            if (props.salaryRangeMin) {
                params.push('salaryRangeMin='+props.salaryRangeMin);
            }
            if (props.salaryRangeMax) {
                params.push('salaryRangeMax='+props.salaryRangeMax);
            }
            if(props.selectedTagIds) {
                props.selectedTagIds.map((tagId: number) => {
                    params.push('tagIds[]='+tagId);
                    return tagId;
                });
            }
            if (params.length) {
                url += '?' + params.join('&');
            }
            return url;
        },
        "tagsJobs": BASE_URL + 'jobs/tagsMap',
        "jobCount": BASE_URL + 'employers/jobCount'
    };
};
export default URLS;