import { Button } from "../../../../components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { EditAddressDialog } from "./EditAddressDialog";
import PropTypes from 'prop-types';

export const AddressCard = ({ address, onEdit, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>{address.street}</div>
        <div>{address.city}, {address.state} {address.zip}</div>
        <div>{address.country}</div>

        <div className="mt-4 flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>

        <EditAddressDialog 
          address={address}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={onEdit}
        />
      </CardContent>
    </Card>
  );
};

AddressCard.propTypes = {
  address: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
