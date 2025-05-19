import { createContext, useContext, useState, useEffect } from "react";

const AddressesContext = createContext();

export function AddressesProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/getcafes");
        const data = await response.json();
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddress(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const value = {
    addresses,
    selectedAddress,
    loading,
    setSelectedAddress,
  };

  return (
    <AddressesContext.Provider value={value}>
      {children}
    </AddressesContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressesContext);
  if (context === undefined) {
    throw new Error("useAddresses must be used within a AddressesProvider");
  }
  return context;
}
