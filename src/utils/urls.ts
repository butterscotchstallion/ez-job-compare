const URLS = () => {
    const BASE_URL = 'http://localhost:5000/api/v1/';

    return {
        "employers": BASE_URL + 'employers',
        "employer": (slug: string) => {
            return BASE_URL + 'employer/'+slug;
        },
        "employerPage": (id: number) => {
            return BASE_URL + 'employers/'+id;
        },
        "tagList": BASE_URL + 'tags',
        "tagsEmployers": BASE_URL + 'employers/tagsMap',
        "jobsPage": "/jobs",
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
            if (props.selectedTags && props.selectedTagIds.length > 0) {
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
        "jobCount": BASE_URL + 'employers/jobCount',
        "login": "/user/login",
        "loginAPI": BASE_URL + 'user/login',
        "dashboard": "/dashboard",
        "isSessionActive": BASE_URL + 'user/session',
        "reviewCountList": (userId?: number) => {
            let url = BASE_URL + 'employer/reviewCountList';

            if (userId) {
                url += '?userId='+userId;
            }

            return url;
        },
        "reviewsAPI": (employerSlug: string) => {
            return BASE_URL + 'employer/'+employerSlug+'/reviews'
        },
        "verifiedEmployeesAPI": (employerSlug?: string) => {
            let url = BASE_URL + 'employer/verifiedEmployees';
            if (employerSlug) {
                url = BASE_URL + 'employer/'+employerSlug+'/verifiedEmployees';
            }
            return url;
        },
        "addReviewAPI": BASE_URL + 'employer/reviews',
        "addJobAPI": BASE_URL + 'employer/job',
        "recruitersAPI": BASE_URL + 'recruiters',
        'usersAPI': BASE_URL + 'users',
        'helpfulReviewVotesAPI': (employerSlug: string) => {
            return BASE_URL + 'employer/'+employerSlug+'/helpfulReviewVotes'
        },
        'karmaAPI': (guid: string) => {
            return BASE_URL + 'users/'+guid+'/karma';
        },
        'topKarmaAPI': BASE_URL + 'topKarmaUser',
        'karmaSummary': BASE_URL + 'karmaSummary'
    };
};
export default URLS;