import hello from '../mainAssets/hello.webp'
import { useAuthStore } from '../../../store/authStore';

export default function GreetingRobo() {
  const { user } = useAuthStore();
  return (
     <div className='flex select-none pointer-events-none justify-end items-center'>
      <h1 className='text-8xl w-[80%] flex flex-col justify-center items-center font-black'>
        <span className='text-3xl text-yellow-500'> Namaste </span>
        {user?.firstName || "User"}
        
        </h1>

      <img src={hello} alt="" />
     </div>
  );
}
