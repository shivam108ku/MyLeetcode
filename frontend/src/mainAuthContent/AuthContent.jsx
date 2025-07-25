
import Sidebar from "./MainContent/mainComponent/Sidebar";
import Header from "./MainContent/mainComponent/Header";
import { Outlet } from 'react-router';

const AuthContent = () => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0 md:ml-0">
          <Header />
          {/* ONLY dynamic routes render here */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default AuthContent;
