export interface IJob {
    id: number;
    title: string;
    shortDescription: string;
    longDescription: string;
    salaryRangeStart: number;
    salaryRangeEnd: number;
    employerName: string;
    location: string;
    createdAt: string;
    updatedAt: string;
}