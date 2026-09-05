import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import WorkspaceHeader from "./WorkspaceHeader.jsx";
import MobileTabBar from "./MobileTabBar.jsx";

export default function WorkspaceShell() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <WorkspaceHeader />
        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
