import React, { useEffect, useRef, useState } from "react";
import { FaTimes, FaShoppingBag } from "react-icons/fa";
import gsap from "gsap";
import { buildApiUrl } from "../config/api";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";

const Cart: React.FC<any> = ({
  items,
  removeFromCart,
  updateItemQuantity,
  clearCart,
  isOpen,
  closeCart,
}) => {
  const cartRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showSuccessTick, setShowSuccessTick] = useState(false);

  const TAX_RATE = 0.1;
  const COUPONS: Record<string, any> = {
    WELCOME10: { type: "percent", value: 10 },
    SWEET5: { type: "flat", value: 5 },
    CAFE15: { type: "percent", value: 15 },
  };

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 });
      gsap.to(cartRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
    } else {
      gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3 });
      gsap.to(cartRef.current, { x: "100%", duration: 0.4, ease: "power3.in" });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if ((event as KeyboardEvent).key === "Escape" && isOpen) {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeCart]);

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + Number(item.price) * item.quantity,
    0,
  );

  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? subtotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;

  const safeDiscount = Math.min(discountAmount, subtotal);
  const taxableAmount = Math.max(0, subtotal - safeDiscount);
  const taxAmount = taxableAmount * TAX_RATE;
  const total = taxableAmount + taxAmount;

  const resetCheckoutForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setCouponInput("");
    setAppliedCoupon(null);
    setReceipt(null);
  };

  const applyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase();
    if (!normalized) {
      setAppliedCoupon(null);
      setStatus({ type: "", message: "" });
      return;
    }

    const found = COUPONS[normalized];
    if (!found) {
      setStatus({
        type: "error",
        message: "Invalid coupon code. Try WELCOME10, SWEET5, or CAFE15.",
      });
      return;
    }

    setAppliedCoupon({ code: normalized, ...found });
    setStatus({
      type: "success",
      message: `Coupon ${normalized} applied successfully.`,
    });
  };

  const handleConfirmOrder = async () => {
    if (items.length === 0 || isSubmitting) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      setStatus({
        type: "error",
        message: "Please add your name and phone number.",
      });
      return;
    }

    const phoneValue = customerPhone.trim();
    const hasValidPhoneChars = /^[0-9+\-\s()]+$/.test(phoneValue);
    const digitCount = (phoneValue.match(/\d/g) || []).length;

    if (!hasValidPhoneChars || digitCount < 7) {
      setStatus({
        type: "error",
        message:
          "Phone number is invalid. Use digits only (you can include +, spaces, or -).",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const payload = {
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        notes: notes.trim(),
      },
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      coupon: appliedCoupon?.code || null,
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(safeDiscount.toFixed(2)),
      tax: Number(taxAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
    };

    try {
      const response = await fetch(buildApiUrl("order"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      setStatus({
        type: "success",
        message: "Order confirmed and sent to the cafe.",
      });

      setReceipt({
        orderId: result?.orderId || "N/A",
        createdAt: new Date().toLocaleString(),
        subtotal: subtotal.toFixed(2),
        discount: safeDiscount.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: total.toFixed(2),
        couponCode: appliedCoupon?.code || null,
      });

      setShowSuccessTick(true);
      clearCart();
      setTimeout(() => {
        setShowSuccessTick(false);
      }, 1200);
    } catch {
      setStatus({
        type: "warning",
        message:
          "Could not send order to backend. Keep MySQL and Apache running, then try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[60] invisible opacity-0"
        onClick={closeCart}
        aria-hidden={!isOpen}
      />
      <div
        ref={cartRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform translate-x-full flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="text-2xl font-bold text-stone-800">Your Order</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-stone-200 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <FaTimes className="h-6 w-6 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <FaShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Your cart is empty.</p>
              <p className="text-sm mt-2">
                Add some delicious items from the menu!
              </p>
            </div>
          ) : (
            items.map((item: any) => (
              <CartItem
                key={item.id}
                item={item}
                updateItemQuantity={updateItemQuantity}
                removeFromCart={removeFromCart}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <OrderSummary
            subtotal={subtotal}
            safeDiscount={safeDiscount}
            taxAmount={taxAmount}
            total={total}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            applyCoupon={applyCoupon}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            notes={notes}
            setNotes={setNotes}
            status={status}
            receipt={receipt}
            isSubmitting={isSubmitting}
            showSuccessTick={showSuccessTick}
            handleConfirmOrder={handleConfirmOrder}
          />
        )}
      </div>
    </>
  );
};

export default Cart;
