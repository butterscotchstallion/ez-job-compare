import { ITag } from "../tag/i-tag.interface";

export interface IJob {
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
    tags: ITag[]
}