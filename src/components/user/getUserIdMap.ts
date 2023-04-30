import IUser from "./i-user.interface";

export interface IUserIdMap {
    [userId: number]: IUser
};

export default function getUserIdMap(users: IUser[]): IUserIdMap {
    const userIdMap: IUserIdMap = {};
    users.map((user: IUser) => {
        userIdMap[user.id] = user;
        return user;
    });
    return userIdMap;
};