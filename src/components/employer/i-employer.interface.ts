export default interface IEmployer {
    id: number;
    name: string;
    slug: string;
    description: string;
    jobCount: number;
    jobCountTitle: string;
    website: string;
    userIds: number[];
};