import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Table from './Table';

describe('Table Component', () => {
    const columns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'age', label: 'Age', sortable: true },
        { key: 'email', label: 'Email', sortable: false },
    ];

    const data = [
        { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
    ];

    const renderSortIcon = jest.fn();

    it('renders correctly', () => {
        const { getByText } = render(
            <Table
                columns={columns}
                data={data}
                onSort={() => {}}
                sortField="name"
                sortDirection="asc"
                renderSortIcon={renderSortIcon}
            />
        );
        expect(getByText('Name')).toBeInTheDocument();
        expect(getByText('Age')).toBeInTheDocument();
        expect(getByText('Email')).toBeInTheDocument();
    });

    it('renders data correctly', () => {
        const { getByText } = render(
            <Table
                columns={columns}
                data={data}
                onSort={() => {}}
                sortField="name"
                sortDirection="asc"
                renderSortIcon={renderSortIcon}
            />
        );
        expect(getByText('John Doe')).toBeInTheDocument();
        expect(getByText('Jane Smith')).toBeInTheDocument();
        expect(getByText('john@example.com')).toBeInTheDocument();
        expect(getByText('jane@example.com')).toBeInTheDocument();
    });

    it('calls onSort when sortable column header is clicked', () => {
        const onSort = jest.fn();
        const { getByText } = render(
            <Table
                columns={columns}
                data={data}
                onSort={onSort}
                sortField="name"
                sortDirection="asc"
                renderSortIcon={renderSortIcon}
            />
        );
        fireEvent.click(getByText('Name'));
        expect(onSort).toHaveBeenCalledWith('name');
    });

    it('does not call onSort when non-sortable column header is clicked', () => {
        const onSort = jest.fn();
        const { getByText } = render(
            <Table
                columns={columns}
                data={data}
                onSort={onSort}
                sortField="name"
                sortDirection="asc"
                renderSortIcon={renderSortIcon}
            />
        );
        fireEvent.click(getByText('Email'));
        expect(onSort).not.toHaveBeenCalled();
    });

    it('renders actions correctly', () => {
        const renderActions = jest.fn().mockReturnValue(<button>Action</button>);
        const { getAllByText } = render(
            <Table
                columns={columns}
                data={data}
                onSort={() => {}}
                sortField="name"
                sortDirection="asc"
                renderSortIcon={renderSortIcon}
                renderActions={renderActions}
            />
        );
        expect(getAllByText('Action')).toHaveLength(data.length);
    });
});
