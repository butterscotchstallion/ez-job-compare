import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";
import UserAvatar from "./UserAvatar";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ReactTimeAgo from "react-time-ago";
import UserRoles from "./UserRoles";

export default function UserProfile({ user }: any) {
    return (
        <Card>
            <CardHeader
                avatar={
                    <UserAvatar user={user} title='User avatar' />
                }
                title={user.name}
                subheader={
                    <>
                        <div>
                            Created <ReactTimeAgo
                                date={new Date(user.createdAt)}
                                locale="en-US"
                                timeStyle="round"/>
                        </div>
                        {user.updatedAt ? (
                            <div>
                                Updated <ReactTimeAgo
                                    date={new Date(user.updatedAt)}
                                    locale="en-US"
                                    timeStyle="round"/>
                            </div>
                        ) : ''}                        
                        <div>
                            <UserRoles roles={user.roles} />
                        </div>
                    </>
                }
            />
        </Card>
    );
};