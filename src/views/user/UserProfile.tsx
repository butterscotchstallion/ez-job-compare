import { Card, CardContent, CardHeader, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { IReviewCountList } from "../../components/reviews/getReviewCountMap";
import getReviewsCountList from "../../components/reviews/getReviewsCountList";
import UserAvatar from "./UserAvatar";
import UserRoles from "./UserRoles";
import './user-profile.scss';
import getVerifiedEmployees from "../../components/employer/getVerifiedEmployees";
import { IVerifiedEmployeesMap } from "../../components/employer/getVerifiedEmployeesMap";
import getEmployersVerifiedMap, { IEmployersVerifiedMap } from "../../components/employer/getEmployersVerifiedMap";
import { extend } from "lodash";
import VerifiedTitle from "./VerifiedTitle";

export default function UserProfile({ user }: any) {
    const [loading, setLoading] = useState(false);
    const [reviewCounts, setReviewCounts] = useState<IReviewCountList[]>([]);
    
    useEffect(() => {
        getProfileData();
    }, []);

    function getProfileData() {
        setLoading(true);

        Promise.all([
            getReviewsCountList(user.id),
            getVerifiedEmployees()
        ])
        .then((response: any) => {
            const verifiedMap: IEmployersVerifiedMap = getEmployersVerifiedMap(response[1].data.results);
            const results = response[0].data.results.map((reviewCounts: any) => {
                reviewCounts.verificationInfo = null;
                if (typeof verifiedMap[reviewCounts.employerId] !== 'undefined') {
                    reviewCounts.verificationInfo = verifiedMap[reviewCounts.employerId];
                }
                return reviewCounts;
            });
            setReviewCounts(results);
        }, (error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    }
    
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
                        {loading ? <CircularProgress /> : ''}
                        {reviewCounts.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="Employers">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="employer-tbl-header">Employer</TableCell>
                                            <TableCell className="employer-tbl-header">Status</TableCell>
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
                                                <TableCell>
                                                    <VerifiedTitle verifiedInfo={rc.verificationInfo} />
                                                </TableCell>
                                                <TableCell>{rc.reviewCount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : ''}                        
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};