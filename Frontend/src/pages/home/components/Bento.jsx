import { bentoData } from "../data/Data"
const Bento = () => {
  return (
    <div className="lg:px-32 md:px-16 px-4 py-10 z-10 h-auto">
        {/* Grid Container */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:grid-rows-3 md:grid-rows-4 grid-rows-6 gap-4 md:gap-6">
          {bentoData.map((item) => (
            <div key={item.id} className={`${item.card} group`}>
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 transform-gpu origin-center"
              />
              <div className="absolute inset-0 bg-black/40 transition-all duration-500 ease-in-out group-hover:bg-black/60" />
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-bold text-white transition-all duration-300 ease-in-out group-hover:scale-105 origin-left">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-white/90 mt-1 md:mt-2 transition-all duration-300 ease-in-out group-hover:scale-105 origin-left">
                  {item.subtitle}
                </p>
                <p className="text-sm text-white/80 mt-2 max-h-0 group-hover:max-h-24 transition-all duration-500 ease-in-out overflow-hidden group-hover:scale-105 origin-left">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default Bento;
