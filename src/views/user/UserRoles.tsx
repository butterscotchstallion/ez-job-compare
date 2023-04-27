import { Chip } from "@mui/material";
import { IRole } from "./i-role.interface";
import './user-roles.scss';

export default function UserRoles({ roles }: any) {
    return (
        roles && roles.length > 0 ? (
            <div className="user-roles-wrapper">
                {roles.map((role: IRole) => (
                    <Chip key={role.name} label={role.name} />
                ))}
            </div>
        ) : (<></>)        
    );
};