import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";

const Cart = () => {
  const { cartItems, food_list, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);

  // Calculate subtotal
  const subtotal = food_list.reduce((total, item) => {
    const quantity = cartItems[item._id] || 0;
    return total + item.price * quantity;
  }, 0);

  // GST 5%
  const gstRate = 0.05;
  const gstAmount = subtotal * gstRate;

  // Delivery charge (free if subtotal > 100)
  const deliveryCharge = subtotal > 100 ? 0 : 2.5;

  // Grand total calculation considering couponDiscount only if applied
  const grandTotal = subtotal + gstAmount + deliveryCharge - (discountApplied ? couponDiscount : 0);

  // Calculate coupon discount based on subtotal tiers
  const calculateDiscount = () => {
    let discount = 0;
    if (subtotal < 20) {
      discount = subtotal * 0.10; // 10% off
    } else if (subtotal >= 20 && subtotal < 50) {
      discount = subtotal * 0.20; // 20% off
    } else if (subtotal >= 50 && subtotal < 100) {
      discount = subtotal * 0.30; // 30% off
    } else if (subtotal >= 100) {
      discount = subtotal * 0.40; // 40% off
    }
    setCouponDiscount(discount);
    setDiscountApplied(true);
  };

  // Place order button handler
  const handlePlaceOrderClick = () => {
    if (subtotal > 0) {
      navigate("/PlaceOrder");
    } else {
      alert("Your cart is empty!");
    }
  };

  // Show empty cart friendly message and shop button
  if (subtotal === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven’t added any delicious tomatoes yet!</p>
        <button className="shop-now-btn" onClick={() => navigate("/")}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item, index) => {
          const quantity = cartItems[item._id] || 0;
          if (quantity > 0) {
            return (
              <div key={index} className="cart-items-title cart-items-items">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>${item.price}</p>
                <p>{quantity}</p>
                <p>${(item.price * quantity).toFixed(2)}</p>
                <p
                  onClick={() => removeFromCart(item._id)}
                  style={{ cursor: "pointer", color: "red", fontWeight: "bold" }}
                >
                  x
                </p>
              </div>
            );
          }
          return null;
        })}

        {/* Billing summary aligned right */}
        <div className="cart-billing">
          <p><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
          <p><span>GST (5%):</span> <span>${gstAmount.toFixed(2)}</span></p>
          <p>
            <span>Delivery Charge:</span>{" "}
            {deliveryCharge === 0 ? (
              <span className="free-delivery">Free Delivery</span>
            ) : (
              <span>${deliveryCharge.toFixed(2)}</span>
            )}
          </p>
          <p><span>Coupon Discount:</span> <span>- ${discountApplied ? couponDiscount.toFixed(2) : "0.00"}</span></p>

          <hr />
          <h3 style={{ textAlign: "right", marginTop: "10px" }}>
            Grand Total: ${grandTotal.toFixed(2)}
          </h3>

          {!discountApplied && subtotal > 0 && (
            <button className="apply-discount-btn" onClick={calculateDiscount}>
              Apply Discount
            </button>
          )}
        </div>

        {/* Place Order Button */}
        <div className="cart-placeorder">
          <button className="placeorder-btn" onClick={handlePlaceOrderClick}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
