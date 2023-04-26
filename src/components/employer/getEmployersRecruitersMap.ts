import { IRecruitersList } from "./getRecruiters";

export interface IEmployersRecruitersMap {
    [employerId: number]: number[];
};

interface IRecruitersListItem {
    userId: number;
    employerId: number;
};

export default function getEmployersRecruitersMap(recruiters: IRecruitersList[]): IEmployersRecruitersMap {
    const erMap: IEmployersRecruitersMap = {};

    recruiters.map((r: IRecruitersListItem) => {
        if (typeof erMap[r.employerId] === 'undefined') {
            erMap[r.employerId] = [];
        }
        erMap[r.employerId].push(r.userId);
        return r;
    });

    return erMap;
};