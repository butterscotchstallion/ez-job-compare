export interface IReviewCountList {
    employerId: number;
    reviewCount: number;
};
export interface IReviewCountMap {
    [employerId: number]: number;
};

export default function getReviewCountMap(list: IReviewCountList[]): IReviewCountMap {
    const reviewCountMap: IReviewCountMap = {};

    list.map((reviewCount: IReviewCountList) => {
        reviewCountMap[reviewCount.employerId] = reviewCount.reviewCount;
        return reviewCount;
    });

    return reviewCountMap;
};