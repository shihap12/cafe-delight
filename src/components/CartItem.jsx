import React from "react";

const CartItem = ({ item, updateItemQuantity, removeFromCart }) => {
  return (
    <div className="flex gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100 items-center">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="flex-1">
        <h4 className="font-bold text-stone-800">{item.name}</h4>
        <p className="text-sm text-stone-500">
          ${Number(item.price).toFixed(2)} x {item.quantity}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-bold text-amber-700">
          ${(Number(item.price) * item.quantity).toFixed(2)}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateItemQuantity(item.id, -1)}
            className="w-7 h-7 rounded-md bg-stone-200 text-stone-700 font-bold hover:bg-stone-300"
            aria-label={`Decrease ${item.name} quantity`}
          >
            -
          </button>
          <span className="w-6 text-center text-sm font-semibold text-stone-700">
            {item.quantity}
          </span>
          <button
            onClick={() => updateItemQuantity(item.id, 1)}
            className="w-7 h-7 rounded-md bg-stone-200 text-stone-700 font-bold hover:bg-stone-300"
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
