import IVerifiedEmployee from "./i-verified-employee.interface";

export interface IVerifiedEmployeesMap {
    [userId: number]: IVerifiedEmployee;
};

export default function getVerifiedEmployeesMap(verifiedEmployees: IVerifiedEmployee[]): IVerifiedEmployeesMap {
    const veMap: IVerifiedEmployeesMap = {};
    verifiedEmployees.map((ve: IVerifiedEmployee) => {
        veMap[ve.userId] = ve;
        return ve;
    });
    return veMap;
};