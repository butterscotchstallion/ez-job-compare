import IVerifiedEmployee from "./i-verified-employee.interface";

export interface IEmployersVerifiedMap {
    [employerId: number]: IVerifiedEmployee[];
};

export default function getVerifiedEmployeesMap(verifiedEmployees: IVerifiedEmployee[]): IEmployersVerifiedMap {
    const veMap: IEmployersVerifiedMap = {};
    verifiedEmployees.map((ve: IVerifiedEmployee) => {
        if (typeof veMap[ve.employerId] === 'undefined') {
            veMap[ve.employerId] = [];
        }
        veMap[ve.employerId].push(ve);
        return ve;
    });
    return veMap;
};