import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";

export const AddressDialog = ({ title, children, open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

AddressDialog.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool,
  onOpenChange: PropTypes.func
};