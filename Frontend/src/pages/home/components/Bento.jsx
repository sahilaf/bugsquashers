import bentoData from "../data/bentoData.json"; // Import JSON data
import BentoCard from "./BentoCard";

const Bento = () => {
  return (
    <div className="lg:px-32 md:px-16 px-4 h[110%] py-10 z-10 ">
      {/* Grid Container */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:grid-rows-3 md:grid-rows-4 grid-rows-6 gap-4 md:gap-6">
        {bentoData.map((item) => (
          <div key={item.id} className={`${item.card}`}>
            <BentoCard
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bento;