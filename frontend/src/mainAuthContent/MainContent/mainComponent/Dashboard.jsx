import IntroCard from "../mainComponent/IntroCard";
import BlogSection from "../mainComponent/BlogSection";
import CardsSection from "../mainComponent/CardsSection";
import TrackYourProgress from "../mainComponent/TrackYourProgress";
import UserRankSection from "../mainComponent/UserRankSection";
import ThreeBackground from "../../../components/ThreeBackground";

const Dashboard = () => {
  return (
    <div className="p-2 sm:p-4 md:px-6 mr-5 lg:px-10 max-w-[93%] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Main content: stacks on mobile, left on desktop */}
        <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
          <IntroCard />
          <ThreeBackground />
          <div className="flex flex-col gap-4 md:gap-6">
            <TrackYourProgress />
            <BlogSection />
          </div>
        </div>
        {/* Sidebar: below on mobile, right on desktop */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
          <UserRankSection />
          <CardsSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
