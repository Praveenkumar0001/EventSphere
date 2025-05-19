import GooglePayButton from "@google-pay/button-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const GooglePaymentButton = ({ price, setPaymentDone}) => {
  const [isGooglePayLoaded, setIsGooglePayLoaded] = useState(false);

  return (
    <GooglePayButton
      environment="TEST"
      buttonType="pay"
      paymentRequest={{
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["MASTERCARD", "VISA"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: "example",
                gatewayMerchantId: "exampleGatewayMerchantId",
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: "12345678901234567890",
          merchantName: "Demo Merchant",
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPriceLabel: "Total",
          totalPrice: `${price}`,
          currencyCode: "INR",
          countryCode: "IN",
        },
        shippingAddressRequired: true,
        callbackIntents: ["SHIPPING_ADDRESS", "PAYMENT_AUTHORIZATION"],
      }}
      onLoadPaymentData={(paymentRequest) => {
        console.log("Success", paymentRequest);
        setIsGooglePayLoaded(true);
      }}
      onReadyToPayChange={({ isReadyToPay }) => {
        if (isReadyToPay) setIsGooglePayLoaded(true);
      }}
      onPaymentAuthorized={(paymentData) => {
        console.log("Payment Authorised Success", paymentData);
        toast.success("Payment completed successfully.");
        setPaymentDone(true);
        return { transactionState: "SUCCESS" };
      }}
      onPaymentDataChanged={(paymentData) => {
        console.log("On Payment Data Changed", paymentData);
        return {};
      }}
      existingPaymentMethodRequired="false"
      buttonColor="black"
    />
  );
};

export default GooglePaymentButton;
