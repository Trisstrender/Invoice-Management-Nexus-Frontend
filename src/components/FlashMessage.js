import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const FlashMessage = ({ theme, text }) => {
    const themeClasses = {
        success: 'bg-green-100 border-green-500 text-green-700',
        danger: 'bg-red-100 border-red-500 text-red-700'
    };

    const icons = {
        success: <CheckCircle className="inline-block mr-2" />,
        danger: <AlertCircle className="inline-block mr-2" />
    };

    return (
        <div className={`p-4 mb-4 text-sm border-l-4 rounded-r ${themeClasses[theme]}`}>
            {icons[theme]}
            {text}
        </div>
    );
};

export default FlashMessage;