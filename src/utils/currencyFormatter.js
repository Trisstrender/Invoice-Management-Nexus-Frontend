// Formats a number as Czech currency (CZK)
export const formatCurrency = (amount, includeCurrency = true) => {
    const formatter = new Intl.NumberFormat('cs-CZ', {
        style: includeCurrency ? 'currency' : 'decimal',
        currency: 'CZK',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(amount);
};

export default formatCurrency;