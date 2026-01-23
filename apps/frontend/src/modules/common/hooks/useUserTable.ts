import { useState, useEffect, useMemo } from 'react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import type { User } from '@tme/shared-types';
import { userService } from '../services/userService';

export const useUserTable = () => {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'firstName', desc: false }]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const users = await userService.fetchUsers();
                setData(users);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'firstName',
                header: 'First Name',
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
            },
            {
                accessorKey: 'emailAddress',
                header: 'Email',
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableSortingRemoval: false,
    });

    return {
        table,
        loading,
        error,
        globalFilter,
        setGlobalFilter,
    };
};
