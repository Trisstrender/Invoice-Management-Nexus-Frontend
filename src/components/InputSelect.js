import React from "react";

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