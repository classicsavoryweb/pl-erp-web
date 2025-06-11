export function translateToTagalog(phrase: string): string {
    const translations: Record<string, string> = {
        'month': 'buwan',
        'months': 'buwan',
        'day': 'araw',
        'days': 'araw',
        'year': 'taon',
        'years': 'taon',
        'week': 'linggo',
        'weeks': 'linggo',
        'Month': 'Buwan',
        'Months': 'Buwan',
        'Day': 'Araw',
        'Days': 'Araw',
        'Year': 'Taon',
        'Years': 'Taon',
        'Week': 'Linggo',
        'Weeks': 'Linggo',
    };

    return phrase.replace(/\b(\d+)\s+(months?|days?|years?|weeks?)\b/gi, (_, number, unit) => {
        const tagalogUnit = translations[unit] || unit;
        return `${number} ${tagalogUnit}`;
    });
}