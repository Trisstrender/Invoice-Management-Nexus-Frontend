import React from 'react';
import {ArrowRight, BarChart2, FileText, Users} from 'lucide-react';
import {Link} from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-animate flex flex-col justify-center items-center p-6">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-white mb-4">
                    Invoice Management Nexus
                </h1>
                <p className="text-xl text-white opacity-90">
                    Your central hub for efficient invoice processing
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {[
                    {
                        icon: <Users size={24}/>,
                        title: 'Manage Persons',
                        description: 'Organize your clients and contacts efficiently',
                        link: '/persons'
                    },
                    {
                        icon: <FileText size={24}/>,
                        title: 'Handle Invoices',
                        description: 'Create, track, and manage invoices seamlessly',
                        link: '/invoices'
                    },
                    {
                        icon: <BarChart2 size={24}/>,
                        title: 'View Statistics',
                        description: 'Gain valuable insights from your financial data',
                        link: '/statistics'
                    },
                ].map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className="bg-white bg-opacity-20 rounded-lg p-6 hover:bg-opacity-30 transition-all duration-300 block h-full"
                        aria-label={item.title}
                    >
                        <div className="text-white mb-4">{item.icon}</div>
                        <h2 className="text-xl font-semibold text-white mb-2">{item.title}</h2>
                        <p className="text-white opacity-80 mb-4">{item.description}</p>
                        <div className="text-white flex items-center">
                            Enter <ArrowRight size={16} className="ml-2"/>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default WelcomePage;