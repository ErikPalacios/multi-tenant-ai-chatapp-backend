/**
 * ARCHIVO: page.tsx (Landing Page - Página de Aterrizaje)
 * 
 * En Next.js (App Router), cualquier archivo llamado `page.tsx` se convierte automáticamente 
 * en una ruta accesible en el navegador. Como este archivo está en la raíz de la carpeta `[locale]`, 
 * esta es la página principal que se carga al entrar a "tudominio.com/es" o "tudominio.com/en".
 *
 * NOTA: Este es un "Server Component" (Componente de Servidor) por defecto, lo que significa 
 *       que se renderiza rapidísimo en el servidor de Node antes de llegar al navegador. 
 *       No lleva "use client" arriba porque no tiene interactividad compleja (como onClick o useState).
 */

// 1. IMPORTACIONES
// `useTranslations` es un "Hook" (función especial) de la librería 'next-intl'. Nos permite 
//  traer textos en diferentes idiomas (Inglés/Español) dependiendo de la URL actual.
import { useTranslations } from "next-intl";

// Componente optimizado de Next.js para imágenes. A diferencia de un <img> normal de HTML, 
// este comprime la imagen y no la carga hasta que el usuario hace scroll hacia ella.
import Image from "next/image";

// Nuestro enrutador personalizado (Link) que creamos para que los enlaces no borren el 
// prefijo del idioma (ej: /es/login en lugar de solo /login).
import { Link } from "@/i18n/routing";

// 2. COMPONENTE PRINCIPAL
// La función obligatoriamente debe llamarse con export default para que Next.js entienda 
// que esta es la página que debe dibujar.
export default function Home() {
  // Inicializamos el hook de traducciones diciéndole que queremos usar 
  // el diccionario de la página "HomePage" (ubicado en tus archivos .json de idiomas).
  const t = useTranslations("HomePage");

  // El "return" devuelve el JSX (este cruce raro entre HTML y JavaScript).
  return (
    // Las clases largas ("className") son de Tailwind CSS. Sirven para dar estilo sin escribir CSS normal.
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-16 bg-white dark:bg-black text-center">

        {/* Renderizado de un logo local estático */}
        <Image
          className="dark:invert mb-12" // Clases para que se invierta el color si el compu está en Modo Oscuro
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority // 'priority' le dice a Next.js que esta imagen es urgente y la cargue de inmediato.
        />

        <h1 className="text-4xl font-bold text-primary tracking-tight mb-4">
          {/* Aquí inyectamos el texto dinámicamente usando nuestro traductor `t` */}
          {t("title")}
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
          {t("description")}
        </p>

        {/* Link se usa en lugar del tag <a> de HTML para navegar rápido sin recargar toda la página */}
        <Link
          href="/login"
          className="px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
        >
          Ir al Login
        </Link>
      </main>
    </div>
  );
}
