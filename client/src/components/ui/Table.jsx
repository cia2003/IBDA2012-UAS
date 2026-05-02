function Table({ columns = [], data = [] }) {
    const safeData = Array.isArray(data) ? data : [];

    const formatCellValue = (value) => {
        if (value === null || value === undefined || value === "") return '—';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (typeof value === 'number' && !isNaN(value)) {
            // Format Rupiah jika nilainya besar (opsional)
            if (value >= 100000) return `Rp${value.toLocaleString('id-ID')}`;
            return value;
        }
        return value;
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.accessor} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {safeData.length > 0 ? (
                            safeData.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.accessor} className="px-6 py-4 text-sm text-gray-800">
                                            {col.cell 
                                                ? col.cell(item[col.accessor], item) 
                                                : formatCellValue(item[col.accessor])
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500 italic">
                                    Tidak ada data tersedia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Table;