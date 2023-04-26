import { ITag } from "../tag/i-tag.interface";

export interface IJob {
    [index: string]: any;
    id: number;
    title: string;
    shortDescription: string;
    longDescription: string;
    salaryRangeStart: number;
    salaryRangeEnd: number;
    employerName: string;
    employerSlug: string;
    location: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    formattedDate: string;
    formattedDateRelative: string;
    tags: ITag[],
    companySize: string;
    employerWebsite: string;
    reviewCount: number;
    employerId: number;
}