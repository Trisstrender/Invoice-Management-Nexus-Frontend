import React from "react";

/**
 * FlashMessage component for displaying temporary messages.
 *
 * @param {Object} props - Component props
 * @param {string} props.theme - The theme of the message (e.g., 'success', 'danger')
 * @param {string} props.text - The text content of the message
 * @returns {React.Element} A div element with the message
 */
export function FlashMessage({theme, text}) {
    return <div className={"alert alert-" + theme}>{text}</div>;
}

export default FlashMessage;