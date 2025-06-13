import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";

export default function HomePage() {
  return (
    <>
      <AppHeader breadcrumbs={[{ label: "Accueil" }]} />
      <main className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Bienvenue sur <span className="text-primary">Gateway</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl">
          Une plateforme minimaliste pour explorer et regarder vos vidéos en
          streaming local, rapide et élégant.
        </p>
        <div className="mt-6">
          <Link href="/video">
            <Button size="lg">Voir les vidéos</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
