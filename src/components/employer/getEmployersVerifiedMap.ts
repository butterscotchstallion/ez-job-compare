import IVerifiedEmployee from "./i-verified-employee.interface";

export interface IEmployersVerifiedMap {
    [employerId: number]: IVerifiedEmployee;
};

export default function getVerifiedEmployeesMap(verifiedEmployees: IVerifiedEmployee[]): IEmployersVerifiedMap {
    const veMap: IEmployersVerifiedMap = {};
    verifiedEmployees.map((ve: IVerifiedEmployee) => {
        veMap[ve.employerId] = ve;
        return ve;
    });
    return veMap;
};