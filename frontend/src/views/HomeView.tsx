import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Toaster } from "sonner";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";

export default function HomeView() {
  const location = useLocation();
  const navigate = useNavigate();
  const toastShown = useRef(false);

  useEffect(() => {
    if (location.state?.loggedOut && !toastShown.current) {
      toastShown.current = true;
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-100 bg-no-repeat bg-right-top xl:bg-home overflow-hidden flex items-center justify-center xl:justify-start">
          <div className="max-w-5xl mx-auto w-full flex items-center justify-center xl:justify-start">
            <div className="w-full xl:w-1/2 px-6 md:px-10 xl:p-0 space-y-6 py-10 md:py-16 xl:py-0">
              <SearchForm />
            </div>
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
}