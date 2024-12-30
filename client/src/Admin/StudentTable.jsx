/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const Table = ({ data, onEdit }) => {
  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full bg-white border-gray-200 rounded-md h-full">
        <thead className="bg-gray-100 ">
          <tr>
            <th className="text-left px-4 py-2 font-medium text-gray-600">
              Full Name
            </th>
            <th className="text-left px-4 py-2 font-medium text-gray-600">
              Gender
            </th>
            <th className="text-left px-4 py-2 font-medium text-gray-600">
              Trade
            </th>
            <th className="text-left px-4 py-2 font-medium text-gray-600">
              City
            </th>
            {window.location.pathname === "/admin/std" && (
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={crypto.randomUUID()} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 text-blue-600 font-medium cursor-pointer">
                {row.fullName}
              </td>
              <td className="px-4 py-2 text-gray-800">{row.gender}</td>
              <td className="px-4 py-2 text-gray-800">{row.trade}</td>
              <td className="px-4 py-2 text-gray-800">{row.city}</td>
              {window.location.pathname === "/admin/std" && (
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => onEdit(row.cnic, row.trade)} // Trigger the edit function with the row's id
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
