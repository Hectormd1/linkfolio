import { Link, useLocation } from "react-router-dom";
import { APP_PATHS, matchPath } from "../utils/paths";

export default function Logo() {
  const isLoggedIn = Boolean(localStorage.getItem("AUTH_TOKEN"));
  const location = useLocation();

  // Detecta si la ruta actual es /:handle y no coincide con otras rutas fijas
  const isHandleRoute =
    matchPath(location.pathname) &&
    !Object.values(APP_PATHS)
      .filter((path) => path !== APP_PATHS.HANDLE && !path.includes(":"))
      .some((path) => path === location.pathname);

  // Si está logado y en /:handle, dirige a /admin, si no, a /
  const linkTo = isLoggedIn && isHandleRoute ? "/admin" : "/";

  return (
    <Link to={linkTo}>
      <img src="/logo.svg" className="w-full block" alt="Logotipo LinkFolio" />
    </Link>
  );
}
