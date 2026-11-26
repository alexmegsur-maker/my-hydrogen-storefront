import { redirect } from "react-router";

/**
 * Si la URL usa un handle que no es el del idioma activo (p. ej. el español
 * bajo /fr), redirige al handle traducido. Es una redirección permanente
 * (301): la URL correcta de ese recurso en ese idioma es siempre la otra, y
 * así Google consolida las señales en ella.
 */
export function redirectIfHandleIsLocalized(
  request: Request,
  ...localizedResources: Array<{
    handle: string;
    data: { handle: string } & unknown;
  }>
) {
  const url = new URL(request.url);
  let shouldRedirect = false;

  for (const { handle, data } of localizedResources) {
    if (handle !== data.handle) {
      url.pathname = url.pathname.replace(handle, data.handle);
      shouldRedirect = true;
    }
  }

  if (shouldRedirect) {
    throw redirect(url.toString(), 301);
  }
}
