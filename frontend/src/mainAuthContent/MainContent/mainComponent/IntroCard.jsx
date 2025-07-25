
import PerformanceChart from '../Templates/PerformanceChart';
import GreetingRobo from '../Templates/GreetingRobo'

const BalanceCard = () => {
  return (
 <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 sm:p-8 
 border border-slate-700/50 shadow-lg w-full max-w-6xl mx-auto">
  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
    
    {/* Left Side: Chart */}
    <div className="w-full  md:w-[45%]">

   <PerformanceChart />  
    </div>

    {/* Right Side / Greeting / Image */}
    <div className="w-full p-6 md:w-1/3 flex justify-center items-center">
      <div className="h-full">
        <GreetingRobo 
        />
      </div>
    </div>

  </div>
</div>

  );
};

export default BalanceCard;