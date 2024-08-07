import React from 'react';
import { CheckSquare, Radio } from 'lucide-react';

const InputCheck = ({ type, name, value, checked, handleChange, label }) => {
    const inputTypes = ['checkbox', 'radio'];
    const inputType = type.toLowerCase();

    if (!inputTypes.includes(inputType)) {
        return null;
    }

    const icons = {
        checkbox: <CheckSquare className="inline-block mr-2" />,
        radio: <Radio className="inline-block mr-2" />
    };

    return (
        <div className="flex items-center mb-4">
            {icons[inputType]}
            <input
                type={inputType}
                id={name}
                name={name}
                value={value}
                checked={checked}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor={name} className="ml-2 text-sm font-medium text-gray-900">
                {label}
            </label>
        </div>
    );
};

export default InputCheck;