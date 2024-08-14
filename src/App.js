import React from "react";
import {BrowserRouter as Router, Link, Route, Routes, useLocation} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import {BarChart2, FileText, Users} from "lucide-react";

import PersonIndex from "./persons/PersonIndex";
import PersonDetail from "./persons/PersonDetail";
import PersonForm from "./persons/PersonForm";
import InvoiceIndex from "./invoices/InvoiceIndex";
import InvoiceDetail from "./invoices/InvoiceDetail";
import InvoiceForm from "./invoices/InvoiceForm";
import Statistics from "./statistics/Statistics";
import WelcomePage from "./WelcomePage";

export function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link to="/"
                                          className="text-2xl font-bold text-primary-600 hover:text-primary-800 transition-colors duration-200">
                                        Invotriss
                                    </Link>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <NavLink to="/persons" icon={<Users size={20}/>}>Persons</NavLink>
                                    <NavLink to="/invoices" icon={<FileText size={20}/>}>Invoices</NavLink>
                                    <NavLink to="/statistics" icon={<BarChart2 size={20}/>}>Statistics</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="flex-grow py-10 mt-16">
                    <main>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <AnimatePresence mode="wait">
                                <Routes>
                                    <Route path="/" element={<WelcomePage/>}/>
                                    <Route path="/persons" element={<PersonIndex/>}/>
                                    <Route path="/persons/show/:id" element={<PersonDetail/>}/>
                                    <Route path="/persons/create" element={<PersonForm/>}/>
                                    <Route path="/persons/edit/:id" element={<PersonForm/>}/>
                                    <Route path="/invoices" element={<InvoiceIndex/>}/>
                                    <Route path="/invoices/show/:id" element={<InvoiceDetail/>}/>
                                    <Route path="/invoices/create" element={<InvoiceForm/>}/>
                                    <Route path="/invoices/edit/:id" element={<InvoiceForm/>}/>
                                    <Route path="/statistics" element={<Statistics/>}/>
                                </Routes>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>

                <footer className="bg-white shadow-md mt-auto">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500">
                            © 2024 Invotriss. Developed by Jan Dalewski
                        </p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

const NavLink = ({to, children, icon}) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    const activeClassName = isActive ? "border-primary-600 text-primary-600" : "border-transparent text-secondary-600 hover:text-primary-600 hover:border-primary-600";

    return (
        <Link
            to={to}
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium transition-colors duration-200 ${activeClassName}`}
        >
            {icon}
            <span className="ml-2">{children}</span>
        </Link>
    );
};

export default App;