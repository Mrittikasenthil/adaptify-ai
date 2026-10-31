import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const [brandProfiles, setBrandProfiles] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshBrands = async () => {
    try {
      setLoading(true);
      const profiles = await api.getBrandProfiles();
      setBrandProfiles(profiles);
      const active = profiles.find((p) => p.is_active) || profiles[0] || null;
      setActiveBrand(active);
    } catch (e) {
      console.error("Error loading brand profiles", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBrands();
  }, []);

  const selectActiveBrand = async (profileId) => {
    try {
      await api.activateBrandProfile(profileId);
      await refreshBrands();
    } catch (e) {
      console.error("Failed to activate brand", e);
      // Optimistic update
      setBrandProfiles((prev) =>
        prev.map((p) => ({ ...p, is_active: p.id === profileId }))
      );
      const chosen = brandProfiles.find((p) => p.id === profileId);
      if (chosen) setActiveBrand({ ...chosen, is_active: true });
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brandProfiles,
        activeBrand,
        setActiveBrand,
        refreshBrands,
        selectActiveBrand,
        loading
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
