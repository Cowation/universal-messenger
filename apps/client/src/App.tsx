import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";

function App() {
  return (
    <div className="flex h-full flex-row">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default App;
