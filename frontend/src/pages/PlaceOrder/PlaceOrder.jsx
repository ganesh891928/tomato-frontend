import React, { useContext, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { cartItems, food_list } = useContext(StoreContext);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    doorNo: "",
    street: "",
    area: "",
    landmark: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const totalPrice = food_list.reduce((total, item) => {
    const quantity = cartItems[item._id] || 0;
    return total + item.price * quantity;
  }, 0);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    // Check required fields except landmark
    const requiredFields = ["name", "doorNo", "street", "area", "phone"];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        setError(`Please enter your ${field.replace(/([A-Z])/g, " $1")}.`);
        return false;
      }
    }
    // Optional: Add phone number format validation here
    setError("");
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    if (totalPrice <= 0) {
      setError("Your cart is empty!");
      return;
    }
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="placeorder-container">
        <h2>Thank you for your order!</h2>
        <p>Your order has been placed with Cash on Delivery.</p>
        <p><strong>Delivery Address:</strong></p>
        <p>{formData.name}</p>
        <p>{formData.doorNo}, {formData.street}</p>
        <p>{formData.area}</p>
        {formData.landmark && <p>Landmark: {formData.landmark}</p>}
        <p>Phone: {formData.phone}</p>
      </div>
    );
  }

  return (
    <div className="placeorder-container">
      <h2>Enter Your Delivery Address</h2>
      {error && <p className="error-msg">{error}</p>}
      <form className="placeorder-form" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />
        </label>
        <label>
          Door No
          <input
            type="text"
            name="doorNo"
            value={formData.doorNo}
            onChange={handleChange}
            placeholder="Door number"
            required
          />
        </label>
        <label>
          Street
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street name"
            required
          />
        </label>
        <label>
          Area
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Area/Locality"
            required
          />
        </label>
        <label>
          Landmark (Optional)
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="Nearby landmark"
          />
        </label>
        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            required
          />
        </label>

        <p><strong>Total Amount: </strong>${totalPrice.toFixed(2)}</p>

        <button type="submit" className="placeorder-btn">Confirm Order (COD)</button>
      </form>
    </div>
  );
};

export default PlaceOrder;
