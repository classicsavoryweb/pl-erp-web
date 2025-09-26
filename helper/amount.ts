export function numberToWords(n: number): string {
    const a = [
        '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
        'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (n < 20) {
        return a[n];
    }

    if (n < 100) {
        const tens = b[Math.floor(n / 10)];
        const ones = n % 10;
        return ones ? `${tens}-${a[ones]}` : tens;
    }

    if (n < 1000) {
        const hundreds = a[Math.floor(n / 100)] + ' Hundred';
        const remainder = n % 100;
        return remainder ? `${hundreds} ${numberToWords(remainder)}` : hundreds;
    }

    if (n < 1_000_000) {
        const thousands = Math.floor(n / 1000);
        const remainder = n % 1000;
        const thousandsPart = `${numberToWords(thousands)} Thousand`;
        return remainder ? `${thousandsPart} ${numberToWords(remainder)}` : thousandsPart;
    }

    return ''; // Extend this logic if you need to support thousands or more
}

export function convertToPesosAndCentavos(amount: number): string {
    const [pesos, centavos] = amount.toFixed(2).split('.').map(Number);

    const pesosText = pesos === 0 ? 'Zero Pesos' : `${numberToWords(pesos)} Pesos`;
    const centavosText = centavos === 0 ? '' : ` and ${numberToWords(centavos)} Centavos`;

    return pesosText + centavosText;
}

export function formatNumber(amount: string | number) {
    return Number(amount)
        .toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
}