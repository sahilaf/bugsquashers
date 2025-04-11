import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { EditAddressDialog } from "./EditAddressDialog";

export const AddressCard = ({ address, onEdit, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Address details */}
        <div className="mt-4 space-x-2">
          <EditAddressDialog 
            address={address}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSave={onEdit}
          />
          <Button variant="outline" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

AddressCard.propTypes = {
  address: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};