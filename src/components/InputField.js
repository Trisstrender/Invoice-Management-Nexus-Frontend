import React from 'react';

const InputField = ({ type = "text", name, label, value, handleChange, required, min, rows, error }) => {
    // List of valid input types
    const inputTypes = ['text', 'number', 'date', 'textarea', 'email'];
    // Ensure the input type is valid, default to 'text' if not
    const inputType = inputTypes.includes(type.toLowerCase()) ? type.toLowerCase() : 'text';
    // Check if the input should be a textarea
    const isTextarea = inputType === 'textarea';

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-secondary-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {isTextarea ? (
                <textarea
                    id={name}
                    name={name}
                    rows={rows || 3}
                    value={value}
                    onChange={handleChange}
                    required={required}
                    minLength={min}
                    className={`mt-1 block w-full px-4 py-3 rounded-md border ${error ? 'border-red-500' : 'border-secondary-300'} shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-lg`}
                />
            ) : (
                <input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    required={required}
                    min={min}
                    className={`mt-1 block w-full px-4 py-3 rounded-md border ${error ? 'border-red-500' : 'border-secondary-300'} shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 text-lg`}
                />
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default InputField;