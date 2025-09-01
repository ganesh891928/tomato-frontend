import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";

const Cart = () => {
  const { cartItems, food_list, removeFromCart } = useContext(StoreContext);

  if (!cartItems || !food_list) return <div>Loading...</div>;

  return (
    <div className="cart">
      <div className="cart-items">
        {/* Header Row */}
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {/* Cart Items */}
        {food_list.map((items, index) => {
          if (cartItems[items._id] && cartItems[items._id] > 0) {
            return (
              <div key={index} className="cart-items-title cart-items-items">
                <img src={items.image} alt={items.name} />
                <p>{items.name}</p>
                <p>₹{items.price}</p>
                <p>{cartItems[items._id]}</p> {/* quantity */}
                <p>₹{items.price * cartItems[items._id]}</p>
                <p
                  onClick={() => removeFromCart(items._id)}
                  style={{ cursor: "pointer", color: "red", fontWeight: "bold" }}
                >
                  x
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Cart;
