import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import IUser from "../../components/user/i-user.interface";

export default function LoggedInUserMenu({ user }: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
    const avatarPath = "/images/";
    let avatar = avatarPath;
    
    if (user.avatarFilename) {
        avatar += user.avatarFilename;
    }

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMenuOpen(true);
        setAnchorEl(e.currentTarget);
    }
    const onClose = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <Button aria-controls={isMenuOpen ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                    onClick={onClick}>
                <Avatar 
                    title={"Logged in as "+user.name}
                    src={avatar}
                    />
            </Button>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={onClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={onClose}>Profile</MenuItem>
                <MenuItem onClick={onClose}>My account</MenuItem>
                <MenuItem onClick={onClose}>Logout</MenuItem>
            </Menu>
        </>
    );
}