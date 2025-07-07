import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from "./views/LoginView"
import RegisterView from "./views/RegisterView"
import AuthLoyauts from "./layouts/AuthLoyauts"
import AppLayout from "./layouts/AppLayout"
import LinkTreeView from "./views/LinkTreeView"
import ProfileView from "./views/ProfileView"
import HandleView from "./views/HandleView"
import NotFoundView from "./views/NotFoundView"
import HomeView from "./views/HomeView"
import { APP_PATHS } from "./utils/paths"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLoyauts />}>
          <Route path={APP_PATHS.AUTH_LOGIN} element={<LoginView />} />
          <Route path={APP_PATHS.AUTH_REGISTER} element={<RegisterView />} />
        </Route>
        <Route path={APP_PATHS.ADMIN} element={<AppLayout />}>
          <Route index={true} element={<LinkTreeView />} />
          <Route path="profile" element={<ProfileView />} />
        </Route>
        <Route path={APP_PATHS.HANDLE} element={<AuthLoyauts />}>
          <Route index={true} element={<HandleView />} />
        </Route>
        <Route path={APP_PATHS.ROOT} element={<HomeView />} />
        <Route path={APP_PATHS.NOT_FOUND} element={<AuthLoyauts />}>
          <Route index={true} element={<NotFoundView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
