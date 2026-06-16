import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { loadLayers } from "./store/mapSlice";
import { AppRouter } from "./router/AppRouter";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadLayers());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
