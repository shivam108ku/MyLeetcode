import WelcomeModel from '../components/WelcomeModel';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero'
import Topics from './Topics';
import Footer from './Footer';



const Home = () => {
 
  return (
    <div className='h-screen w-full overflow-y-auto'>
  
      {/* Navbar */}
      <Navbar />
      {/* NavClosed */}

      {/* Hero Section */}
      {/* <Hero /> */}
      <Hero />
      {/* Hero Section Closed */}

      {/* Welcome  */}
      <div className='hidden md:block'>
        <WelcomeModel />
        {/* <MaskHero /> */}
      </div>
      {/* Closed */}

      {/* Connected Frnd */}
      <Topics/>
      {/* Closed */}

      {/* Footer */}
       <Footer/>
      {/* Closed */}


    </div>
  );
};

export default Home;
