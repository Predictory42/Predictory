import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router";

import { Home } from "@/routes/Home";
import { Create } from "@/routes/Create";
import { Profile } from "@/routes/Profile";
import { PredictoryID } from "@/routes/PredictoryID";

import { APP_ROUTES } from "./constants";

const Pages: FC = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.HOME} element={<Home />} />
      <Route path={APP_ROUTES.CREATE} element={<Create />} />
      <Route path={APP_ROUTES.PROFILE(":address")} element={<Profile />} />
      <Route
        path={APP_ROUTES.PREDICTORY_ID(":id")}
        element={<PredictoryID />}
      />
      <Route path="*" element={<Navigate replace to={APP_ROUTES.HOME} />} />
    </Routes>
  );
};

export default Pages;
