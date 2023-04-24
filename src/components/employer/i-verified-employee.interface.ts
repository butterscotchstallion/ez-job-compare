export default interface IVerifiedEmployee {
    userId: number;
    employerId: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    isCurrentEmployee: boolean;
};