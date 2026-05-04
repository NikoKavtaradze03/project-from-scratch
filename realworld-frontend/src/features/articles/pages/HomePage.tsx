import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

import { ArticleFeedTabs } from "../components/ArticleFeedTabs";
import PopularTagsCard from "@/features/tags/components/PopularTagsCard";

function HomePage() {
  return (
    <main>
      <PageContainer>
        <PageHeader title="Home" description="Welcome to the home page!" />
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ArticleFeedTabs />

          <PopularTagsCard />
        </section>
      </PageContainer>
    </main>
  );
}

export default HomePage;
