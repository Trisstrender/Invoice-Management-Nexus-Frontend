import React from "react";
import {Link} from "react-router-dom";
import {apiDelete} from "../utils/api";
import {Plus} from "lucide-react";
import FlashMessage from "../components/FlashMessage";
import PersonTable from "./PersonTable";
import FilterComponent from "../components/FilterComponent";
import PaginationComponent from "../components/PaginationComponent";
import useIndexPage from "../utils/useIndexPage";

const PersonIndex = () => {
    const {
        items: persons,
        loading,
        currentPage,
        itemsPerPage,
        totalPages,
        sortField,
        sortDirection,
        filters,
        showFilters,
        flashMessage,
        setFlashMessage,
        handleSort,
        handlePageChange,
        handleItemsPerPageChange,
        setFilters,
        setShowFilters,
        renderSortIcon,
        loadItems,
    } = useIndexPage("/api/persons", "name");

    const deletePerson = async (id) => {
        const personToDelete = persons.find(p => p.id === id);
        if (personToDelete && window.confirm(`Are you sure you want to delete ${personToDelete.name}?`)) {
            try {
                await apiDelete("/api/persons/" + id);
                setFlashMessage({
                    type: 'success',
                    text: `Person "${personToDelete.name}" has been successfully deleted.`
                });
                loadItems();
            } catch (error) {
                console.error("Error deleting person:", error);
                setFlashMessage({
                    type: 'error',
                    text: `Error deleting person: ${error.message}`
                });
            }
        }
    };

    const filterFields = [
        {name: "name", placeholder: "Filter by Name"},
        {name: "identificationNumber", placeholder: "Filter by Identification Number"},
    ];

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6 text-secondary-800">List of Persons</h1>

            {flashMessage && (
                <div className="mb-4">
                    <FlashMessage type={flashMessage.type} text={flashMessage.text}/>
                </div>
            )}

            <FilterComponent
                filters={filters}
                setFilters={setFilters}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                fields={filterFields}
            />

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            ) : (
                <>
                    <PersonTable
                        persons={persons}
                        deletePerson={deletePerson}
                        handleSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        renderSortIcon={renderSortIcon}
                    />

                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={handleItemsPerPageChange}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            <Link
                to="../persons/create"
                className="mt-8 inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
                <Plus className="inline-block mr-1"/> New Person
            </Link>
        </div>
    );
};

export default PersonIndex;