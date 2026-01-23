import { flexRender } from '@tanstack/react-table';
import { useUserTable } from '../../hooks/useUserTable';
import './userTable.component.css';

export const UserTable = () => {
    const { table, loading, error, globalFilter, setGlobalFilter } = useUserTable();

    if (loading) return <div className="user-table-loading">Loading users...</div>;
    if (error) return <div className="user-table-error">{error}</div>;

    return (
        <div className="user-table-container">
            <div className="user-table-controls">
                <input
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search all columns..."
                    className="user-table-search"
                />
            </div>
            <table className="user-table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="user-table-header">
                                    <div
                                        {...{
                                            className: header.column.getCanSort()
                                                ? 'cursor-pointer select-none sortable'
                                                : '',
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? ' ↕️' : null)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="user-table-row">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="user-table-cell">
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="user-table-pagination">
                <div className="pagination-info">
                    <span>
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                </div>
                <div className="pagination-controls">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                </div>
                <div className="pagination-page-size">
                    <span>Rows per page:</span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 50, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                        <option value={1000000}>All</option>
                    </select>
                </div>
            </div>
        </div>
    );
};
