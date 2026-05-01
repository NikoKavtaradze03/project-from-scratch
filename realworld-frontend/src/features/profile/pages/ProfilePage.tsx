import PageContainer from "@/components/layout/PageContainer";

function ProfilePage() {
  return (
    <main className="py-8">
      <PageContainer>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            User profile and authored/favorited articles will go here.
          </p>
        </div>
      </PageContainer>
    </main>
  );
}

export default ProfilePage;
