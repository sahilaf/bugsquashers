import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { AddressCard } from "./AddressCard";
import { AddAddressDialog } from "./AddAddressDialog";

export const SavedAddresses = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Handler functions...

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
      <CardContent>
        {/* Address cards */}
        <AddressCard/>
      </CardContent>
    </Card>
  );
};