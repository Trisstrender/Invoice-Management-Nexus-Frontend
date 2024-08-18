// Formats a date string into localized or ISO format
export const dateStringFormatter = (str, locale = false) => {
    const d = new Date(str);

    if (locale) {
        // Return date in localized format (Czech)
        return d.toLocaleDateString("cs-CZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    // Return date in ISO format (YYYY-MM-DD)
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