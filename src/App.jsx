import { QueryClient, QueryClientProvider } from "react-query";
import Router from "./Router";
import AntdHeader from "./components/header/AntdHeader";
import { Loader } from "./components/spin/Loader";
import { LoaderProvider, useLoader } from "./context/loader";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LoaderProvider>
          <AppLoader />
          <AntdHeader />
          <Router />
        </LoaderProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;

function AppLoader() {
  const { isLoading } = useLoader();
  return isLoading ? <Loader /> : null;
}
