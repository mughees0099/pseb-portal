import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

const TitleLayout = ({ title }) => (
  <>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Outlet />
  </>
);

export default TitleLayout;
