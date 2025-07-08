import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
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
      toast.success("Sesión cerrada correctamente");
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-100 bg-no-repeat bg-right-top bg-home max-1750:bg-none overflow-hidden flex items-center max-1750:justify-center max-1750:items-center">
          <div className="max-w-5xl mx-auto w-full flex items-center">
            <div className="w-full max-1750:w-full lg:w-1/2 px-10 lg:p-0 space-y-6">
              <SearchForm />
            </div>
          </div>
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
}