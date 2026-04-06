import { Outlet } from "react-router-dom";
import Sidebar from "../src/components/navbar/Sidebar";
import Header from "../src/components/navbar/Header";

function Layout() {
  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-transparent">
      <Sidebar />

      <div className="flex flex-col flex-1 min-h-0">
        <Header />

        <main className="flex-1 overflow-y-auto min-h-0 bg-gray-100 p-3">
          <div className="mx-auto flex min-h-full w-full max-w-400 flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;