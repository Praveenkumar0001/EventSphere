import GooglePaymentButton from "@/components/ui/google-payment-button";

export default function PaymentForEvent() {
  return (
    <div>
      <GooglePaymentButton price={100} setPaymentDone={false} />
    </div>
  );
}
