const Table = ({ data = [] }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Full Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Gender
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Trade
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            City
          </th>
          {window.location.pathname === "/admin/std" && (
            <th className="text-left px-4 py-2 font-medium text-gray-600">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((record, index) => (
          <tr key={index}>
            <td className="px-6 py-4">{record.fullName}</td>
            <td className="px-6 py-4">{record.gender}</td>
            <td className="px-6 py-4">{record.trade}</td>
            <td className="px-6 py-4">{record.city}</td>
            {window.location.pathname === "/admin/std" && (
              <td className="px-6 py-4">
                <button
                  onClick={record.onEdit} // Call the onEdit function
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
