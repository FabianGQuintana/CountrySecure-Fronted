// Tema claro/oscuro: la elección se guarda en localStorage y se aplica como clase `dark` en <html>.
// Sin elección guardada se sigue la preferencia del sistema operativo.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "cs-theme";

/**
 * Script que corre en <head> antes de pintar: evita el "flash" de tema claro al cargar en modo oscuro.
 * Se mantiene mínimo y sin dependencias porque se inyecta como texto.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})();`;
