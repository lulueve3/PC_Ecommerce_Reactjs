import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const styles = {
    container: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        margin: '50px auto',
    },
    successIcon: {
        color: '#28a745',
        fontSize: '48px',
        marginBottom: '20px',
    },
    heading: {
        color: '#28a745',
    },
    paragraph: {
        color: '#333',
        fontSize: '18px',
    },
};

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "#c4f0ff",
            color: "#fff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" }
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee"
        }
    }
}

export default function PaymentForm({ amount, onSuccess, success }) {
    const [paymentSuccess, setPaymentSuccess] = useState(success || false);


    const stripe = useStripe()
    const elements = useElements()


    const handleSubmit = async (e) => {
        e.preventDefault()
        toast.info('Paying', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })


        if (!error) {
            try {
                const { id } = paymentMethod
                const response = await axios.post("http://mousecomputer-api.southeastasia.cloudapp.azure.com/api/payment/create-payment-intent", {
                    amount: Number(amount) * 100,
                    id
                })

                if (response.data === "Payment successful") {
                    console.log("Successful payment")
                    onSuccess();

                }
                else {
                    toast.error('Payment faild!, Try again', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }


            } catch (error) {
                toast.error('Payment faild!, Try again', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } else {
            console.log(error.message)
        }
    }

    return (
        <>
            <ToastContainer />
            {!paymentSuccess ?
                <form onSubmit={handleSubmit}>
                    <fieldset className="FormGroup">
                        <h2>Total: {amount} $</h2>
                        <div className="FormRow">
                            <CardElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <button class="pay-button">Pay</button>
                </form>
                :
                <div>
                    <h2 style={styles.heading}>Payment Successful</h2>
                    <p style={styles.paragraph}>Thank you for your payment.</p>
                </div>
            }

        </>
    )
}