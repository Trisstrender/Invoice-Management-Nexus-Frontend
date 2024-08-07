import React from "react";
import { BrowserRouter as Router, Link, Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Users, FileText, BarChart2 } from "lucide-react";

import PersonIndex from "./persons/PersonIndex";
import PersonDetail from "./persons/PersonDetail";
import PersonForm from "./persons/PersonForm";
import InvoiceIndex from "./invoices/InvoiceIndex";
import InvoiceDetail from "./invoices/InvoiceDetail";
import InvoiceForm from "./invoices/InvoiceForm";
import Statistics from "./components/Statistics";

export function App() {
    return (
        <Router>
            <div className="min-h-screen bg-secondary-100">
                <nav className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <span className="text-2xl font-bold text-primary-600">Invoice App</span>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <NavLink to="/persons" icon={<Users size={20} />}>Persons</NavLink>
                                    <NavLink to="/invoices" icon={<FileText size={20} />}>Invoices</NavLink>
                                    <NavLink to="/statistics" icon={<BarChart2 size={20} />}>Statistics</NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="py-10">
                    <main>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <AnimatePresence mode="wait">
                                <Routes>
                                    <Route path="/" element={<Navigate to="/persons" />} />
                                    <Route path="/persons" element={<PersonIndex />} />
                                    <Route path="/persons/show/:id" element={<PersonDetail />} />
                                    <Route path="/persons/create" element={<PersonForm />} />
                                    <Route path="/persons/edit/:id" element={<PersonForm />} />
                                    <Route path="/invoices" element={<InvoiceIndex />} />
                                    <Route path="/invoices/show/:id" element={<InvoiceDetail />} />
                                    <Route path="/invoices/create" element={<InvoiceForm />} />
                                    <Route path="/invoices/edit/:id" element={<InvoiceForm />} />
                                    <Route path="/statistics" element={<Statistics />} />
                                </Routes>
                            </AnimatePresence>
                        </div>
                    </main>
                </div>
            </div>
        </Router>
    );
}

const NavLink = ({ to, children, icon }) => (
    <Link
        to={to}
        className="text-secondary-600 hover:text-primary-600 hover:border-primary-600 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium transition-colors duration-200"
    >
        {icon}
        <span className="ml-2">{children}</span>
    </Link>
);

export default App;