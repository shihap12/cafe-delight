import React from "react";

const CartItem = ({ item, updateItemQuantity, removeFromCart }) => {
  return (
    <div className="flex gap-4 p-4 rounded-xl border items-center transition-colors duration-300" style={{ backgroundColor: "var(--cafe-surface-card)", borderColor: "var(--cafe-border)" }}>
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h4 className="font-bold" style={{ color: "var(--cafe-surface-text)" }}>{item.name}</h4>
        <p className="text-sm" style={{ color: "var(--cafe-surface-muted)" }}>
          ${Number(item.price).toFixed(2)} x {item.quantity}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-bold" style={{ color: "var(--cafe-accent)" }}>
          ${(Number(item.price) * item.quantity).toFixed(2)}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateItemQuantity(item.id, -1)}
            className="w-7 h-7 rounded-md font-bold transition-colors duration-200"
            style={{ backgroundColor: "var(--btn-bg)", color: "var(--btn-text)" }}
            aria-label={`Decrease ${item.name} quantity`}
          >
            -
          </button>
          <span className="w-6 text-center text-sm font-semibold" style={{ color: "var(--cafe-surface-text)" }}>
            {item.quantity}
          </span>
          <button
            onClick={() => updateItemQuantity(item.id, 1)}
            className="w-7 h-7 rounded-md font-bold transition-colors duration-200"
            style={{ backgroundColor: "var(--btn-bg)", color: "var(--btn-text)" }}
            aria-label={`Increase ${item.name} quantity`}
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-xs text-red-500 hover:text-red-700 font-medium underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
