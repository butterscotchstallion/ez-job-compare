import axios from 'axios';
import URLS from '../../utils/urls';
import IHelpfulReviewVote from './i-helpful-review-vote.interface';

export interface IReviewVoteMap {
    [reviewId: number]: IHelpfulReviewVote[]
};
export interface IHasVotedMap {
    [userId: number]: boolean;
};

export function getHasVotedMap(votes: IHelpfulReviewVote[]) {
    const hasVotedMap: IHasVotedMap = {};
    votes.map((vote: IHelpfulReviewVote) => {
        if (typeof hasVotedMap[vote.userId] === 'undefined') {
            hasVotedMap[vote.userId] = true;
        }
        return vote;
    });
    return hasVotedMap;
};

export function getReviewVotesMap(votes: IHelpfulReviewVote[]): IReviewVoteMap {
    const voteMap: IReviewVoteMap = {};
    votes.map((vote: IHelpfulReviewVote) => {
        if (typeof voteMap[vote.reviewId] === 'undefined') {
            voteMap[vote.reviewId] = [];
        }
        voteMap[vote.reviewId].push(vote);
        return vote;
    });
    return voteMap;
};

export default function getHelpfulReviewVotes(employerSlug: string) {
    return axios.get(URLS().helpfulReviewVotesAPI(employerSlug));
};