import { IRole } from "../../views/user/i-role.interface";

export default interface IUser {
    id: number;
    name: string;
    avatarFilename: string;
    createdAt: string;
    updatedAt: string;
    roles: IRole[];
};