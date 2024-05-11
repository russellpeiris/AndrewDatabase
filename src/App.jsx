import Router from "./Router";
import AntdHeader from "./components/header/AntdHeader";
import { Loader } from "./components/spin/Loader";
import { LoaderProvider, useLoader } from "./context/loader";

function App() {
  return (
    <>
      <LoaderProvider>
        <AppLoader />
        <AntdHeader />
        <Router />
      </LoaderProvider>
    </>
  );
}

export default App;

function AppLoader() {
  const { isLoading } = useLoader();
  return isLoading ? <Loader /> : null;
}
