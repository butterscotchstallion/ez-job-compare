import { Autocomplete, TextField } from "@mui/material";
import IUser from "../../components/user/i-user.interface";
import { useEffect, useState } from "react";
import getUsers from "../../components/user/getUsers";
import getVerifiedEmployees from "../../components/employer/getVerifiedEmployees";
import getVerifiedEmployeesMap, { IVerifiedEmployeesMap } from "../../components/employer/getVerifiedEmployeesMap";

export default function UserAutocomplete({ onChange, employerSlug }: any) {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<IUser[]>([]);
    let verifiedUsersMap: IVerifiedEmployeesMap = {};

    useEffect(() => {
        getUsersAndVerificationInfo();
    }, [loading]);

    function getUsersAndVerificationInfo() {
        Promise.all([
            getUsers(),
            getVerifiedEmployees(employerSlug)
        ]).then((response: any) => {
            verifiedUsersMap = getVerifiedEmployeesMap(response[1].data.results);
            const users = response[0].data.results.map((user: IUser) => {
                user.verified =  typeof verifiedUsersMap[user.id] !== 'undefined';
                return user;
            });
            setUsers(users);
        }, (error: any) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <Autocomplete
            disablePortal
            options={users}
            sx={{ width: 300 }}
            onChange={onChange}
            loading={loading}
            getOptionLabel={(user: IUser) => user.name}
            renderInput={(params: any) => <TextField {...params} label="User" />}
        />
    );
};