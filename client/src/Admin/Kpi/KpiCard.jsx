/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const KpiCard = ({
  heading,
  icon,
  value,
  bgColor,
  bgCard,
  iconColor,
  headindCard,
  valueCard,
}) => {
  return (
    <div
      className="flex items-center bg-white rounded-lg shadow-sm p-6 w-full"
      style={{ backgroundColor: bgCard }}
    >
      <div
        className={`flex items-center justify-center p-3 rounded-md`}
        style={{ backgroundColor: bgColor }}
      >
        <FontAwesomeIcon
          icon={icon}
          className=" text-4xl "
          style={{ color: iconColor }}
        />
      </div>
      <div className="ml-4">
        <h4
          className="text-lg font-bold text-gray-500"
          style={{ color: headindCard }}
        >
          {heading}
        </h4>
        <p
          className="text-4xl font-bold text-gray-800"
          style={{ color: valueCard }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;
