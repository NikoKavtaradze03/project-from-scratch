import PageContainer from "@/components/layout/PageContainer";
import AuthCard from "../components/AuthCard";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <PageContainer variant="auth">
        <AuthCard
          title="Sign up"
          footerText="Already have an account?"
          footerLinkText="Sign in"
          footerLinkTo="/login"
        >
          <RegisterForm />
        </AuthCard>
      </PageContainer>
    </main>
  );
}

export default RegisterPage;
