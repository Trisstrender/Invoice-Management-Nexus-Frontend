import React from 'react';
import {AlertCircle, AlertTriangle, CheckCircle} from 'lucide-react';

const FlashMessage = ({type, text}) => {
    // Define styles for different message types
    const themeClasses = {
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-700'
    };

    // Define icons for different message types
    const icons = {
        success: <CheckCircle className="inline-block mr-2"/>,
        error: <AlertCircle className="inline-block mr-2"/>,
        warning: <AlertTriangle className="inline-block mr-2"/>
    };

    return (
        <div className={`p-4 mb-4 text-sm border-l-4 rounded-r ${themeClasses[type]}`}>
            {icons[type]}
            {text}
        </div>
    );
};

export default FlashMessage;