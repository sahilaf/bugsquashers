import PropTypes from 'prop-types';
import { AddressDialog } from "./AddressDialog";
import { AddressForm } from "./AddressForm";

export const AddAddressDialog = ({ open, onOpenChange, onAdd }) => {
  const handleSubmit = (newAddress) => {
    onAdd({ ...newAddress, id: Date.now() });
    onOpenChange(false);
  };

  return (
    <AddressDialog 
      title="Add New Address" 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <AddressForm onSubmit={handleSubmit} />
    </AddressDialog>
  );
};

AddAddressDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};