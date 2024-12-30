/* eslint-disable react/prop-types */
// import Sidebar from "./Sidebar.jsx";
import ProfileForm from "./Profile.jsx";

export default function CandidateProfilePage({ userData }) {
  return (
    <main className="flex-1">
      <ProfileForm userData={userData} />
    </main>
  );
}
