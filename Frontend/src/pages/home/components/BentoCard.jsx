import PropTypes from 'prop-types';

const BentoCard = ({ image, title, subtitle, description, card }) => {
  return (
    <div className={`${card}`}>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 transform-gpu origin-center"
      />
      <div className="absolute inset-0 bg-black/40 transition-all duration-500 ease-in-out group-hover:bg-black/60" />
      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
        <h3 className="text-xl md:text-2xl font-bold text-white transition-all duration-300 ease-in-out group-hover:scale-105 origin-left">
          {title}
        </h3>
        <p className="text-sm md:text-base text-white/90 mt-1 md:mt-2 transition-all duration-300 ease-in-out group-hover:scale-105 origin-left">
          {subtitle}
        </p>
        <p className="text-sm text-white/80 mt-2 max-h-0 group-hover:max-h-24 transition-all duration-500 ease-in-out overflow-hidden group-hover:scale-105 origin-left">
          {description}
        </p>
      </div>
    </div>
  );
};

// Add PropTypes validation
BentoCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  card: PropTypes.string.isRequired,
};

export default BentoCard;
