/**
 * Formats a number as Czech currency (CZK)
 *
 * @param {number} amount - The amount to format
 * @param {boolean} [includeCurrency=true] - Whether to include the currency symbol
 * @returns {string} The formatted currency string
 */
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