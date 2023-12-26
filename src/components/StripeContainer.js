import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "./PaymentForm"

const stripePromise = loadStripe('pk_test_51OCo7kAubPxFOcSICukmTYH17tmZnWIvhsWbgpnUFTvhaYrv5qaZ6RmKAnVu9qiF9hXgNvd0Twc32c2Haytv7HIb00DEg10WIs');


export default function StripeContainer({ amount, onSuccess }) {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm amount={amount} onSuccess={onSuccess} />
        </Elements>
    )
}