import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import PropTypes from 'prop-types';
export const AddressForm = ({ address, onSubmit, buttonText = "Save" }) => {
  const [formData, setFormData] = useState(address || {
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      {/* Repeat for other fields */}
      <div className="flex justify-end">
        <Button type="submit">{buttonText}</Button>
      </div>
    </form>
  );
};

AddressForm.propTypes = {
  address: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string
};