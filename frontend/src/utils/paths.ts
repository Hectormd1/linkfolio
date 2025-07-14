export const APP_PATHS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_SOCIAL: "/auth/social",
  ADMIN: "/admin",
  PROFILE: "profile",
  ACCOUNT: "account",
  HANDLE: "/:handle",
  ROOT: "/",
  NOT_FOUND: "/404"
};

// Utilidad para comparar rutas, soportando parámetros dinámicos como :handle
export function matchPath(pathname: string): boolean {
  return Object.values(APP_PATHS).some(pattern => {
    if (pattern.includes(":")) {
      // Convierte /:handle en /^\/[^/]+$/
      const regex = new RegExp("^" + pattern.replace(/:\w+/g, "[^/]+") + "$");
      return regex.test(pathname);
    }
    return pattern === pathname;
  });
}