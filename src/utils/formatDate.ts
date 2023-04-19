export enum dateFormatTypes {
    short,
    relative
};
export default function formatDate(formatMe: string, formatType?: dateFormatTypes): string {
    let formatted = '';

    switch (formatType) {
        default:
        case dateFormatTypes.short:
            formatted = new Date(formatMe).toLocaleDateString(
                'en-US',
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'EST'
                }
            );
        break;

        case dateFormatTypes.relative:

        break;
    }

    return formatted;
}