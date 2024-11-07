import React, { useState } from "react";
import { useCart, useDispatchCart } from "./ContextReducer";

export default function Card(props) {
  let dispatch = useDispatchCart(); // Get dispatch function from context
  let data = useCart(); // Get cart data from context
  let options = props.options; // Price options from props
  let priceoptions = Object.keys(options); // Extract price option keys

  const [qty, setQty] = useState(1); // State for quantity
  const [size, setSize] = useState(""); // State for size

  const handleAddToCart = async () => {
    if (!size) {
      alert("Please select a size");
      return;
    }

    await dispatch({
      type: "ADD",
      id: props.foodItem._id,
      name: props.foodItem.name,
      price: options[size] * qty, // Calculate price based on size and quantity
      qty: qty,
      size: size,
    });

    console.log("Updated Cart:", data); // Log updated cart data
  };

  return (
    <div>
      <div>
        <div
          className="card mt-3"
          style={{ width: "18rem", maxHeight: "360px" }}
        >
          <img
            src={props.foodItem.img}
            className="card-img-top"
            alt={props.foodItem.name}
            style={{ height: "150px", objectFit: "fill" }}
          />
          <div className="card-body">
            <h5 className="card-title">{props.foodItem.name}</h5>
            <div className="container w-100">
              <select
                className="m-2 h-100 bg-success rounded"
                onChange={(e) => setQty(e.target.value)}
              >
                {Array.from(Array(6), (e, i) => {
                  return (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  );
                })}
              </select>
              <select
                className="m-2 h-100 bg-success rounded"
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {priceoptions.map((data) => {
                  return (
                    <option key={data} value={data}>
                      {data}
                    </option>
                  );
                })}
              </select>
              <div className="d-inline h-100 fs-5">
                Total Price: {size ? options[size] * qty : 0} ₹
              </div>
            </div>
            <hr />
            <button
              className="btn btn-success justify-center ms-2"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
