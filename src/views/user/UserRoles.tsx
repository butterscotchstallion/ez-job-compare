import { Chip } from "@mui/material";
import './user-roles.scss';

export default function UserRoles({ roles }: any) {
    const processedRoles = roles.map((r: any) => {
        r.style = r.color ? {backgroundColor: r.color} : null;
        return r;
    });
    return (
        processedRoles && processedRoles.length > 0 ? (
            <div className="user-roles-wrapper">
                {processedRoles.map((role: any) => (
                    <Chip 
                        key={role.name} 
                        color="primary"
                        label={role.name} />
                ))}
            </div>
        ) : (<></>)        
    );
};