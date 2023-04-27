export interface IVerifiedInfo {
    startDate: string;
    endDate: string;
    isCurrentEmployee: boolean;
    userId: number;
    employerId: number;
};

export default function VerifiedTitle({ verifiedInfo }: any) {
    let verifiedTitle = 'Non Employee';

    if (verifiedInfo) {
        verifiedTitle = 'Verified ';
        if (verifiedInfo.isCurrentEmployee) {
            verifiedTitle += ' Current Employee';
        } else {
            verifiedTitle += ' Alumni';
        }
    }    
    return (
        <>
            {verifiedTitle}
        </>
    );
};