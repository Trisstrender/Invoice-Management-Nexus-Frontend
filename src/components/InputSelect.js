import React from "react";

/**
 * InputSelect component for rendering a select dropdown.
 *
 * @param {Object} props - Component props
 * @param {string} props.name - Select name attribute
 * @param {string} props.label - Label text for the select
 * @param {string} props.prompt - Placeholder text for the select
 * @param {Array} props.items - Array of items to populate the select options
 * @param {string|number} props.value - Currently selected value
 * @param {Function} props.handleChange - onChange event handler
 * @param {boolean} props.multiple - Whether multiple selection is allowed
 * @param {boolean} props.required - Whether the select is required
 * @returns {React.Element} A div element with the select dropdown
 */
export function InputSelect(props) {
    const multiple = props.multiple;
    const required = props.required || false;

    return (
        <div className="form-group">
            <label>{props.label}:</label>
            <select
                required={required}
                className="browser-default form-select"
                multiple={multiple}
                name={props.name}
                onChange={props.handleChange}
                value={props.value || ''}
            >
                {required ? (
                    <option disabled value="">
                        {props.prompt}
                    </option>
                ) : (
                    <option value="">
                        ({props.prompt})
                    </option>
                )}
                {props.items.map((item) => (
                    <option key={item.id || item._id} value={item.id || item._id}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default InputSelect;