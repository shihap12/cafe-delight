import React from "react";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { CartItem, Receipt } from "../types";

type OrderSummaryProps = {
  subtotal: number;
  safeDiscount: number;
  taxAmount: number;
  total: number;
  couponInput: string;
  setCouponInput: (v: string) => void;
  applyCoupon: () => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  status: { type?: string; message?: string };
  receipt: Receipt | null;
  isSubmitting: boolean;
  showSuccessTick: boolean;
  handleConfirmOrder: () => void;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  safeDiscount,
  taxAmount,
  total,
  couponInput,
  setCouponInput,
  applyCoupon,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
  status,
  receipt,
  isSubmitting,
  showSuccessTick,
  handleConfirmOrder,
}) => {
  return (
    <div className="p-6 border-t border-stone-100 bg-stone-50">
      <div className="space-y-2 mb-6 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Discount</span>
          <span>- ${safeDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Tax (10%)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-stone-200">
          <span className="text-stone-700 font-semibold">Total</span>
          <span className="text-3xl font-bold text-stone-800">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Coupon code"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="button"
          onClick={applyCoupon}
          className="px-4 py-2 rounded-lg bg-stone-800 text-white text-sm hover:bg-stone-700 transition-colors"
        >
          Apply
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="Your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={customerPhone}
          onChange={(e) =>
            setCustomerPhone(e.target.value.replace(/[^0-9+\-\s()]/g, ""))
          }
          inputMode="tel"
          autoComplete="tel"
          pattern="[0-9+\-\s()]{7,}"
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <textarea
          placeholder="Order notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>

      {status.message && (
        <p
          className={`text-sm mb-4 ${
            status.type === "success"
              ? "text-green-700"
              : status.type === "warning"
                ? "text-amber-700"
                : "text-red-600"
          }`}
        >
          {status.message}
        </p>
      )}

      {receipt && (
        <div className="mb-4 p-4 rounded-lg border border-amber-200 bg-amber-50 text-stone-700 text-sm space-y-1">
          <p className="font-semibold text-amber-700">Receipt</p>
          <p>Order ID: {receipt.orderId}</p>
          <p>Date: {receipt.createdAt}</p>
          {receipt.couponCode && <p>Coupon: {receipt.couponCode}</p>}
          <p>Subtotal: ${receipt.subtotal}</p>
          <p>Discount: -${receipt.discount}</p>
          <p>Tax: ${receipt.tax}</p>
          <p className="font-bold">Total Paid: ${receipt.total}</p>
        </div>
      )}

      <button
        className="w-full relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={handleConfirmOrder}
        disabled={isSubmitting}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        <span className="relative z-10 flex items-center gap-2">
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              <span>Submitting...</span>
            </>
          ) : showSuccessTick ? (
            <>
              <FaCheck className="h-5 w-5" />
              <span>Order Confirmed</span>
            </>
          ) : (
            <>
              <span>Confirm Order</span>
              <FaArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default OrderSummary;
