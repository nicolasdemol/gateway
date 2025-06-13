import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/app-header";
import ImportTab from "./_import-tab";
import DownloadTab from "./_download-tab";
import RegisterTab from "./_register-tab";

export default function UploadOrDownloadPage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[{ label: "Ajouter une vidéo", href: "/download" }]}
      />
      <div className="p-6 max-w-screen-sm w-full mx-auto">
        <Tabs defaultValue="import">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="register">Enregistrer</TabsTrigger>
            <TabsTrigger value="download">Télécharger</TabsTrigger>
            <TabsTrigger value="import">Importer</TabsTrigger>
          </TabsList>
          <RegisterTab />
          <DownloadTab />
          <ImportTab />
        </Tabs>
      </div>
    </>
  );
}
