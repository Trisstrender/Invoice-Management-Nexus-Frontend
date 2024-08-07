import React from 'react';
import {AlignLeft, Calendar, Edit, Hash} from 'lucide-react';

const InputField = ({type, name, label, prompt, value, handleChange, required, min, rows}) => {
    const inputTypes = ['text', 'number', 'date', 'textarea'];
    const inputType = type.toLowerCase();
    const isTextarea = inputType === 'textarea';

    if (!inputTypes.includes(inputType)) {
        return null;
    }

    const icons = {
        text: <Edit className="inline-block mr-2"/>,
        number: <Hash className="inline-block mr-2"/>,
        date: <Calendar className="inline-block mr-2"/>,
        textarea: <AlignLeft className="inline-block mr-2"/>
    };

    const baseClasses = "w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500";

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block mb-2 text-sm font-bold text-gray-700">
                {label}
            </label>
            {isTextarea ? (
                <div>
                    {icons.textarea}
                    <textarea
                        id={name}
                        name={name}
                        rows={rows || 3}
                        placeholder={prompt}
                        value={value}
                        onChange={handleChange}
                        required={required}
                        minLength={min}
                        className={`${baseClasses} resize-y`}
                    />
                </div>
            ) : (
                <div>
                    {icons[inputType]}
                    <input
                        type={inputType}
                        id={name}
                        name={name}
                        placeholder={prompt}
                        value={value}
                        onChange={handleChange}
                        required={required}
                        min={min}
                        className={baseClasses}
                    />
                </div>
            )}
        </div>
    );
};

export default InputField;