import PageContainer from "@/components/layout/PageContainer";

function SettingsPage() {
  return (
    <main className="py-8">
      <PageContainer>
        <div className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-3xl font-bold">Your Settings</h1>
          <p className="text-muted-foreground">Settings form will go here.</p>
        </div>
      </PageContainer>
    </main>
  );
}

export default SettingsPage;
