import { Outlet, useRouterState } from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const hideElement = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideElement ? <Header /> : null}
      <Outlet />
      {!hideElement ? <Footer /> : null}
    </>
  );
}

export default RootLayout;
