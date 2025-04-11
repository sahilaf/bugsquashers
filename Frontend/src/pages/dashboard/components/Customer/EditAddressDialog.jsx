import PropTypes from 'prop-types';
import { AddressDialog } from "./AddressDialog";
import { AddressForm } from "./AddressForm";

export const EditAddressDialog = ({ address, open, onOpenChange, onSave }) => {
  const handleSubmit = (updatedAddress) => {
    onSave(updatedAddress);
    onOpenChange(false);
  };

  return (
    <AddressDialog 
      title="Edit Address" 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <AddressForm 
        address={address}
        onSubmit={handleSubmit}
        buttonText="Save Changes"
      />
    </AddressDialog>
  );
};

EditAddressDialog.propTypes = {
  address: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};