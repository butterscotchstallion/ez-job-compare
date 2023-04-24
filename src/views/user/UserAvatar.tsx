import { Avatar } from "@mui/material";

export default function UserAvatar({ user }: any) {
    const avatarPath = "/images/";
    let avatar = avatarPath;
    
    if (user && user.avatarFilename) {
        avatar += user.avatarFilename;
    }

    return (
        <Avatar 
            title={"Logged in as "+user.name}
            src={avatar}
            />
    );
};