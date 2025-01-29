import { useSearchParams } from "react-router-dom";

const PaymentFailure = () => {
    const [params] = useSearchParams();
    const reference = params.get("reference");

    return (
        <div>
            <h1>Payment Failed</h1>
            <p>Payment reference: {reference}</p>
            <p>Something went wrong. Please try again.</p>
        </div>
    );
};

export default PaymentFailure;
