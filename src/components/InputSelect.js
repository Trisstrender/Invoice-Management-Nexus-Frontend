import React from 'react';
import {ChevronDown} from 'lucide-react';

const InputSelect = ({name, label, prompt, items, value, handleChange, multiple, required, error}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block mb-2 text-sm font-bold text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    multiple={multiple}
                    required={required}
                    className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                    {required ? (
                        <option value="" disabled>
                            {prompt}
                        </option>
                    ) : (
                        <option value="">
                            ({prompt})
                        </option>
                    )}
                    {items.map((item) => (
                        <option key={item.id || item._id} value={item.id || item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"/>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default InputSelect;