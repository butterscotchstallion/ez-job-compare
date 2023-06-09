import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import URLS from '../../utils/urls';
import UserAvatar from './UserAvatar';
import UserProfile from './UserProfile';
import './logged-in-user-menu.scss';
import { destroySession } from '../../components/user/userStorage';

export default function LoggedInUserMenu({ user }: any) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const navigate = useNavigate();
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setMenuOpen(true);
        setAnchorEl(e.currentTarget);
    };
    const onProfileMenuItemClicked = (e: any) => {
        setProfileModalOpen(true);
        setMenuOpen(false);
    };
    const onClose = () => {
        setMenuOpen(false);
        setProfileModalOpen(false);
    };
    const onLogoutClicked = () => {
        destroySession();
        navigate(URLS().login);
    };
    const handlePost = () => {

    };

    return (
        <>
            <Dialog 
                open={isProfileModalOpen}
                onClose={onClose}
                scroll="paper"
                fullWidth={true}
                className="user-profile-dialog">
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handlePost}
                    >
                    <DialogTitle>User Profile</DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12}>
                                <UserProfile user={user} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose} variant="outlined">Close</Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Button aria-controls={isMenuOpen ? 'user-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen ? 'true' : undefined}
                    onClick={onClick}>                    
                <UserAvatar 
                    user={user}
                    className="logged-in-menu-avatar"
                    title={"Logged in as "+user.name} />
            </Button>
            <Menu
                className="logged-in-user-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={onClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                >
                <MenuItem onClick={onProfileMenuItemClicked}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>    
                </MenuItem>
                
                <Divider />

                <MenuItem onClick={onLogoutClicked}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}