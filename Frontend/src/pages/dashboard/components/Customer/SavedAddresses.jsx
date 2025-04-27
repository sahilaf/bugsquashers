import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { AddressCard } from "./AddressCard";
import { AddAddressDialog } from "./AddAddressDialog";

export const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zip: "62704",
      country: "USA",
    },
    {
      id: 2,
      name: "Jane Smith",
      street: "456 Oak Ave",
      city: "Metropolis",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddAddress = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
  };

  const handleEditAddress = (updatedAddress) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
    );
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Saved Addresses</CardTitle>
        </div>
        <AddAddressDialog 
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onAdd={handleAddAddress}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={handleEditAddress}
            onDelete={() => handleDeleteAddress(address.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
};
