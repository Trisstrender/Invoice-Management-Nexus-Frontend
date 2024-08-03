import React from "react";

/**
 * InputCheck component for rendering checkbox or radio inputs.
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Input type ('checkbox' or 'radio')
 * @param {string} props.name - Input name attribute
 * @param {string} props.value - Input value attribute
 * @param {boolean} props.checked - Whether the input is checked
 * @param {Function} props.handleChange - onChange event handler
 * @param {string} props.label - Label text for the input
 * @returns {React.Element|null} A div element with the input and label, or null if invalid type
 */
export function InputCheck(props) {
    const INPUTS = ["checkbox", "radio"];
    const type = props.type.toLowerCase();
    const checked = props.checked || "";

    if (!INPUTS.includes(type)) {
        return null;
    }

    return (
        <div className="form-group form-check">
            <label className="form-check-label">
                <input
                    type={props.type}
                    className="form-check-input"
                    name={props.name}
                    value={props.value}
                    checked={checked}
                    onChange={props.handleChange}
                />{" "}
                {props.label}
            </label>
        </div>
    );
}

export default InputCheck;