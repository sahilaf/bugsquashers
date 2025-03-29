import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

const AddressCard = ({ address, onEditAddress }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{address.street}</p>
        <p>
          {address.city}, {address.state} {address.zip}
        </p>
        <p>{address.country}</p>
        <div className="mt-4 space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <EditAddressDialog 
              address={address} 
              onSave={(updatedAddress) => {
                onEditAddress(updatedAddress);
                setIsDialogOpen(false);
              }} 
            />
          </Dialog>
          <Button variant="outline" size="sm">Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
};

AddressCard.propTypes = {
  address: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired
  }).isRequired,
  onEditAddress: PropTypes.func.isRequired
};

const AddAddressDialog = ({ onAddAddress }) => {
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAddress({
      ...newAddress,
      id: Date.now()
    });
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: ""
    });
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Address</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={newAddress.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            name="street"
            value={newAddress.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={newAddress.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              value={newAddress.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP/Postal Code</Label>
            <Input
              id="zip"
              name="zip"
              value={newAddress.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={newAddress.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save Address</Button>
        </div>
      </form>
    </DialogContent>
  );
};

AddAddressDialog.propTypes = {
  onAddAddress: PropTypes.func.isRequired
};
const EditAddressDialog = ({ address, onSave }) => {
  const [editedAddress, setEditedAddress] = useState(address);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedAddress);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Address</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={editedAddress.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            name="street"
            value={editedAddress.street}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={editedAddress.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              name="state"
              value={editedAddress.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP/Postal Code</Label>
            <Input
              id="zip"
              name="zip"
              value={editedAddress.zip}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={editedAddress.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </DialogContent>
  );
};

const SavedAddresses = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main St",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "USA"
    },
    {
      id: 2,
      name: "Jane Smith",
      street: "456 Elm St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA"
    }
  ]);

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
  };

  const handleEditAddress = (updatedAddress) => {
    setAddresses(addresses.map(addr => 
      addr.id === updatedAddress.id ? updatedAddress : addr
    ));
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>Manage your saved addresses</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Add Address</Button>
          </DialogTrigger>
          <AddAddressDialog onAddAddress={handleAddAddress} />
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <AddressCard 
                key={address.id} 
                address={address} 
                onEditAddress={handleEditAddress}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No saved addresses yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedAddresses;