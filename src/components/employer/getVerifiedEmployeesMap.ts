import IVerifiedEmployee from "./i-verified-employee.interface";

export interface IVerifiedEmployeesMap {
    [userId: number]: boolean;
};

export default function getVerifiedEmployeesMap(verifiedEmployees: IVerifiedEmployee[]): IVerifiedEmployeesMap {
    const veMap: IVerifiedEmployeesMap = {};
    verifiedEmployees.map((ve: IVerifiedEmployee) => {
        veMap[ve.userId] = true;
        return ve;
    });
    return veMap;
};