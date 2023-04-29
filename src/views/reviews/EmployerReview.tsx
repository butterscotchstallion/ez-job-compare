import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Badge, Card, CardActions, CardContent, CardHeader, CircularProgress, IconButton, Typography } from "@mui/material";
import { useState } from 'react';
import ReactTimeAgo from "react-time-ago";
import addHelpfulReviewVote from '../../components/reviews/addHelpfulReviewVote';
import { IReview } from '../../components/reviews/i-review.interface';
import { isVoter } from '../../components/user/getUserRoles';
import UserAvatar from "../user/UserAvatar";
import VerifiedTitle from '../user/VerifiedTitle';
import './reviews.scss';

export default function EmployerReview({ review, verifiedEmployeesMap, userId, currentUserId }: any) {
    const user = {
        name: review.reviewAuthor,
        avatarFilename: review.avatarFilename
    };
    const isVerified = typeof verifiedEmployeesMap[userId] !== 'undefined';
    const verifiedInfo = isVerified ? verifiedEmployeesMap[userId] : null;
    const avatarTitle = isVerified ? 'Verified employee' : 'Submitted by '+user.name;
    const [loading, setLoading] = useState<boolean>(false);

    function handleVoteClick(review: IReview) {
        const isOwnReview = review.reviewAuthorUserId === currentUserId;
        if (!review.currentUserHasVoted && !loading && isVoter() && !isOwnReview) {
            setLoading(true);
            addHelpfulReviewVote(review).then((response: any) => {
                if (response.data.status === 'OK') {
                    review.currentUserHasVoted = true;
                    review.hasVotedClass = 'review-has-voted';
                } else {
                    console.error('access denied: '+response.data.status.message);
                }
            }).finally(() => {
                setLoading(false);
            });
        }
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
                title={
                    <span className={isVerified ? 'verified-text' : ''}>
                        {review.reviewAuthor}
                    </span>
                }
                subheader={
                    <>
                        {isVerified ? (
                            <div className="verified-employee-subheader verified-text">
                                <VerifiedTitle verifiedInfo={verifiedInfo} />
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
            <CardActions disableSpacing>
                <IconButton 
                    aria-label="This review is helpful"
                    title="Indicates this review is helpful"
                    onClick={() => handleVoteClick(review)}>
                    <Badge badgeContent={review.helpfulVoteCount} color="secondary">
                        <FavoriteIcon 
                            className={`review-is-helpful-button ${review.hasVotedClass}`}
                            />
                    </Badge>                    
                    {loading ? <CircularProgress /> : ''}
                </IconButton>
            </CardActions>
        </Card>
    );
};