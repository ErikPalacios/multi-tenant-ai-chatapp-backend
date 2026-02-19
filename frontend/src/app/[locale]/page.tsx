import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-16 bg-white dark:bg-black text-center">
        <Image
          className="dark:invert mb-12"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-4xl font-bold text-primary tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
          {t("description")}
        </p>

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
