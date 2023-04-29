import { Avatar } from "@mui/material";
import './user-avatar.scss';

export default function UserAvatar({ user, title, className }: any) {
    const avatarPath = "/images/";
    let avatar = avatarPath;
    
    if (user && user.avatarFilename) {
        avatar += user.avatarFilename;
    }

    return (
        <div className="user-avatar-wrapper">
            {user.isKarmaCaptain ? (
                <img 
                    src="/images/crown.png"
                    alt="Karma Captain"
                    className="avatar-crown" 
                    />
            ) : ''}
            <Avatar 
                title={title}
                src={avatar}
                className={className}
                />
        </div>
    );
};