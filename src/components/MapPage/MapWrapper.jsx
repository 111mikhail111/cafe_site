import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const MapWrapper = () => {
  return <MapComponent />;
};

export default MapWrapper;
