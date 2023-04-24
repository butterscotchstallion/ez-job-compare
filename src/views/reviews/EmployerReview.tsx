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
    const verifiedInfo = isVerified ? verifiedEmployeesMap[userId] : null;
    const avatarTitle = isVerified ? 'Verified employee' : 'Submitted by '+user.name;
    let verifiedTitle = 'Verified ';
    if (verifiedInfo && verifiedInfo.isCurrentEmployee) {
        verifiedTitle+= ' Current Employee';
    } else if (verifiedInfo && !verifiedInfo.isCurrentEmployee) {
        verifiedTitle += ' Alumni';
    }
    return (
        <Card className="employer-review-card">
            <CardHeader
                className="employer-review-card-header"
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
                    <>
                        {isVerified ? (
                            <div className="verified-employee-subheader">
                                {verifiedTitle}
                            </div>
                        ): ''}
                        <ReactTimeAgo
                            date={new Date(review.createdAt)}
                            locale="en-US"
                            timeStyle="round"/>
                    </>
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