import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginView from "./views/LoginView"
import RegisterView from "./views/RegisterView"
import AuthLoyauts from "./layouts/AuthLoyauts"
import AppLayout from "./layouts/AppLayout"
import LinkFolioView from "./views/LinkFolioView"
import ProfileView from "./views/ProfileView"
import HandleView from "./views/HandleView"
import NotFoundView from "./views/NotFoundView"
import HomeView from "./views/HomeView"
import SocialAuthView from "./views/SocialAuthView"
import AccountView from "./views/AccountView"
import { APP_PATHS } from "./utils/paths"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLoyauts />}>
          <Route path={APP_PATHS.AUTH_LOGIN} element={<LoginView />} />
          <Route path={APP_PATHS.AUTH_REGISTER} element={<RegisterView />} />
          <Route path={APP_PATHS.AUTH_SOCIAL} element={<SocialAuthView />} />
        </Route>
        <Route path={APP_PATHS.ADMIN} element={<AppLayout />}>
          <Route index={true} element={<LinkFolioView />} />
          <Route path={APP_PATHS.PROFILE} element={<ProfileView />} />
          <Route path={APP_PATHS.ACCOUNT} element={<AccountView />} />
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
