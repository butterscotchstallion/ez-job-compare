export interface IJob {
    id: number;
    title: string;
    shortDescription: string;
    longDescription: string;
    salaryRangeStart: number;
    salaryRangeEnd: number;
    location: string;
    createdAt: string;
    updatedAt: string;
}