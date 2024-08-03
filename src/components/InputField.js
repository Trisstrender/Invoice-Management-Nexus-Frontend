import React from "react";

/**
 * InputField component for rendering text, number, date inputs or textarea.
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Input type ('text', 'number', 'date', or 'textarea')
 * @param {string} props.name - Input name attribute
 * @param {string} props.label - Label text for the input
 * @param {string} props.prompt - Placeholder text for the input
 * @param {string|number} props.value - Input value
 * @param {Function} props.handleChange - onChange event handler
 * @param {boolean} props.required - Whether the input is required
 * @param {number} props.min - Minimum value for number/date inputs or minimum length for text/textarea
 * @param {number} props.rows - Number of rows for textarea
 * @returns {React.Element|null} A div element with the input field, or null if invalid type
 */
export function InputField(props) {
    const INPUTS = ["text", "number", "date"];
    const type = props.type.toLowerCase();
    const isTextarea = type === "textarea";
    const required = props.required || false;

    if (!isTextarea && !INPUTS.includes(type)) {
        return null;
    }

    const minProp = props.min || null;
    const min = ["number", "date"].includes(type) ? minProp : null;
    const minlength = ["text", "textarea"].includes(type) ? minProp : null;

    return (
        <div className="form-group">
            <label>{props.label}:</label>
            {isTextarea ? (
                <textarea
                    required={required}
                    className="form-control"
                    placeholder={props.prompt}
                    rows={props.rows}
                    minLength={minlength}
                    name={props.name}
                    value={props.value}
                    onChange={props.handleChange}
                />
            ) : (
                <input
                    required={required}
                    type={type}
                    className="form-control"
                    placeholder={props.prompt}
                    minLength={minlength}
                    min={min}
                    name={props.name}
                    value={props.value}
                    onChange={props.handleChange}
                />
            )}
        </div>
    );
}

export default InputField;