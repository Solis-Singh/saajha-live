
import logoImage from './logo2.png';

const LogoPlaceholder = ({ className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoImage}
        alt="Logo" 
        className="h-20 w-20 mr-2"
      />
      {/* <span className="font-bold text-xl text-blue-700">RYT</span> */}
    </div>
  );
};

export default LogoPlaceholder; 