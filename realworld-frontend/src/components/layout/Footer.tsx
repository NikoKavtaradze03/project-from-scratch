import PageContainer from "./PageContainer";

function Footer() {
  return (
    <footer className="border-t border-(--color-border) bg-(--color-bg) ">
      <PageContainer className="py-6 ">
        <p className="text-sm text-(--color-text-muted)">
          conduit — a RealWorld frontend practice project
        </p>
      </PageContainer>
    </footer>
  );
}

export default Footer;
