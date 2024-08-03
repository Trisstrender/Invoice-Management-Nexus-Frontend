/**
 * Formats a date string into a localized or ISO format.
 *
 * @param {string} str - The date string to format
 * @param {boolean} [locale=false] - Whether to use localized format
 * @returns {string} The formatted date string
 */
export const dateStringFormatter = (str, locale = false) => {
    const d = new Date(str);

    if (locale) {
        return d.toLocaleDateString("cs-CZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    const year = d.getFullYear();
    const month = "" + (d.getMonth() + 1);
    const day = "" + d.getDate();

    return [
        year,
        month.length < 2 ? "0" + month : month,
        day.length < 2 ? "0" + day : day,
    ].join("-");
};

export default dateStringFormatter;