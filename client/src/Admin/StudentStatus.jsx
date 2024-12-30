/* eslint-disable react/prop-types */
import KpiCard from "./Kpi/KpiCard";
import {
  faCheckSquare,
  faSpinner,
  faCancel,
} from "@fortawesome/free-solid-svg-icons";
function StudentStatus({ courses }) {
  return (
    <div className="grid xl:grid-cols-3 md:grid-cols-3  col-span-12 sm:grid-cols-1 gap-10 ">
      <KpiCard
        className="text-yellow-50"
        heading="Approved"
        icon={faCheckSquare}
        value={
          courses.filter((record) => record.status === "Approved").length || 0
        }
        bgColor="#fff"
        bgCard="#86d33d"
        iconColor="#86d33d"
        headindCard="#fff"
        valueCard="#fff"
      />
      <KpiCard
        heading="Pending"
        icon={faSpinner}
        value={
          courses.filter((record) => record.status === "Pending").length || 0
        }
        bgColor="#fff"
        bgCard="#077e8c"
        iconColor="#077e8c"
        headindCard="#fff"
        valueCard="#fff"
      />
      <KpiCard
        heading="Rejected "
        icon={faCancel}
        value={
          courses.filter((record) => record.status === "Rejected").length || 0
        }
        bgColor="#fff"
        bgCard="red"
        iconColor="red"
        headindCard="#fff"
        valueCard="#fff"
      />
    </div>
  );
}

export default StudentStatus;
