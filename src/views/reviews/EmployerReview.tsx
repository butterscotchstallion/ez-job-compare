import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import ReactTimeAgo from "react-time-ago";
import UserAvatar from "../user/UserAvatar";
import './reviews.scss';

export default function EmployerReview({ review, verifiedEmployeesMap, userId }: any) {
    const user = {
        name: review.reviewAuthor,
        avatarFilename: review.avatarFilename
    };
    const isVerified = typeof verifiedEmployeesMap[userId] !== 'undefined';
    const avatarTitle = isVerified ? 'Verified employee' : 'Submitted by '+user.name;
    return (
        <Card className="employer-review-card">
            <CardHeader
                avatar={
                    <UserAvatar 
                        user={user}
                        title={avatarTitle}
                        className={isVerified ? 'verified' : ''}
                    />
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={review.reviewAuthor}
                subheader={
                    <ReactTimeAgo
                        date={new Date(review.createdAt)}
                        locale="en-US"
                        timeStyle="round"/>
                }
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {review.body}
                </Typography>
            </CardContent>
        </Card>
    );
};