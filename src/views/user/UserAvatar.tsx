import { Avatar } from "@mui/material";

export default function UserAvatar({ user, title }: any) {
    const avatarPath = "/images/";
    let avatar = avatarPath;
    
    if (user && user.avatarFilename) {
        avatar += user.avatarFilename;
    }

    return (
        <Avatar 
            title={title}
            src={avatar}
            />
    );
};