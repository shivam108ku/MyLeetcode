import { Mail, User, Loader, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import { useState } from 'react';
import ThreeBackground from '../components/ThreeBackground';
import { Link, useNavigate } from 'react-router';
import StarBorder from '../ui/StarBorder';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import ShinyText from '../ui/ShinyText';
import PixelCard from '../ui/PixelCard';
import { useAuthStore } from '../store/authStore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-[80%] select-none h-screen flex flex-col lg:flex-row items-center justify-center mx-auto overflow-hidden"
    >

      
      <div className="hidden lg:flex flex-col w-full text-white lg:w-1/2 h-[200px] lg:h-full items-center justify-center">
        <PixelCard variant="pink">
          <h1 className='absolute text-white text-center font-black font-arial text-4xl'>
            <ShinyText text="SmartCode" disabled={false} speed={4} className='custom-class' />
          </h1>
        </PixelCard>
        <h1 className='p-5 text-xs font-extralight'>Code Smart🔥 Crack Interviews. Get Hired, <br /> Your Journey to Tech Success Starts Here</h1>
      </div>

       
      <div className="w-full lg:w-[40%] flex justify-center">
        <div className="size-[82vh] w-full rounded-xl flex items-center justify-center p-1 duration-1000 delay-1000">
          <div className="h-full w-[100%] p-[1px] rounded-lg relative overflow-hidden">
            <div className="card-wrapper h-full">
              <div className="relative bg-gradient-to-b from-[#171717] to-[#252525] h-full rounded-[7px] ring-[0.5px] ring-white/10">
                <div className="h-full flex items-center justify-center flex-col p-4">
                  <div className="flex-col flex items-center justify-center">
                    <ThreeBackground />

                   
                    <h2 className="text-3xl font-bold mb-7 text-center bg-gradient-to-r from-zinc-600 via-green-100 to-zinc-600 text-transparent bg-clip-text">
                      <ShinyText text="Create Account" disabled={false} speed={4} className='custom-class' />
                    </h2>

                    <form onSubmit={handleSignup}>
                      <Input
                        icon={User}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />

                      <Input
                        icon={Mail}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                     
                      <div className="relative mb-3">
                        <Input
                          icon={Lock}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter Your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(show => !show)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </div>

                      {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
                      <PasswordStrengthMeter password={password} />

                      <StarBorder
                        as="button"
                        className="custom-class cursor-pointer active:scale-95 my-4 ml-10 w-40"
                        color="cyan"
                        speed="5s"
                        type='submit'
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : 'Sign Up'}
                      </StarBorder>
                    </form>
                  </div>
                  <div className="text-sm text-center text-[#eae6e66d]">
                    Already have an account? <br />
                    <Link to={'/login'} className='text-green-400 '>
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
