import { useState, useEffect } from "react";

const useShopDetails = (userId) => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!userId) {
        setError("User ID is required");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1. Get MongoDB ownerId from Firebase UID
        const userRes = await fetch(
          `http://localhost:3000/api/getuserid/${userId}`
        );
        const userJson = await userRes.json();
        if (!userRes.ok || !userJson.success) {
          throw new Error(userJson.error || "Failed to fetch user data");
        }
        const ownerId = userJson.userId;
        if (!ownerId) {
          throw new Error("Could not retrieve user ID");
        }

        // 2. Fetch shop by ownerId
        const shopRes = await fetch(
          `http://localhost:3000/api/shops/owner/${ownerId}`
        );
        const shopJson = await shopRes.json();
        if (!shopRes.ok || !shopJson.success) {
          throw new Error(shopJson.error || "Failed to fetch shop details");
        }

        // 3. Format and include the _id
        const s = shopJson.data;
        const formattedShop = {
          _id: s._id,
          name: s.name,
          location: `${s.location.coordinates[1].toFixed(4)}, ${s.location.coordinates[0].toFixed(4)}`,
          category: s.category || "Unknown",
          rating: s.rating != null ? s.rating.toFixed(1) : "0.0",
          isCertified: !!s.isOrganicCertified,
        };

        setShop(formattedShop);
      } catch (err) {
        console.error("Error fetching shop details:", err);
        setError(err.message || "Failed to load shop information");
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [userId]);

  return { shop, loading, error };
};

export default useShopDetails;
