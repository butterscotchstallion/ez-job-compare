export interface IReview {
    id: number;
    body: string;
    createdAt: string;
    employerId: number;
    reviewAuthorUserId: number;
    helpfulVotes: number;
    currentUserHasVoted: boolean;
    hasVotedClass: string;
    employerSlug: string;
    helpfulVoteCount: number;
};