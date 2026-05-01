import PageContainer from "@/components/layout/PageContainer";
import AuthCard from "../components/AuthCard";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <PageContainer variant="auth">
        <AuthCard
          title="Sign in"
          footerText="Don't have an account?"
          footerLinkText="Sign up"
          footerLinkTo="/register"
        >
          <LoginForm />
        </AuthCard>
      </PageContainer>
    </main>
  );
}

export default LoginPage;
