import { Card, CardContent, CardHeader, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { IReviewCountList } from "../../components/reviews/getReviewCountMap";
import getReviewsCountList from "../../components/reviews/getReviewsCountList";
import UserAvatar from "./UserAvatar";
import UserRoles from "./UserRoles";
import './user-profile.scss';

export default function UserProfile({ user }: any) {
    const [loading, setLoading] = useState(false);
    const [reviewCounts, setReviewCounts] = useState<IReviewCountList[]>([]);
    
    useEffect(() => {
        setLoading(true);
        getReviewsCountList(user.id).then((response: any) => {
            setReviewCounts(response.data.results);
        }, (error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    }, []);
    
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
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="Employers">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="employer-tbl-header">Employer</TableCell>
                                        <TableCell className="employer-tbl-header">Reviews</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reviewCounts.map((rc: any) => (
                                        <TableRow
                                            key={rc.employerId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {rc.employerName}
                                            </TableCell>
                                            <TableCell>{rc.reviewCount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};