import { IRole } from "../../components/user/i-role.interface";

export default interface IUser {
    id: number;
    name: string;
    avatarFilename: string;
    createdAt: string;
    updatedAt: string;
    roles: IRole[];
    verified?: boolean;
    startDate?: string;
    endDate?: string;
    isKarmaCaptain: boolean;
};