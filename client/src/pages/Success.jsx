import React, { useEffect } from 'react';
import { Button, Result, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Show success message
        message.success('Payment Successful!');

        // Clear local storage and Redux state
        localStorage.removeItem('cartItems'); // Clear specific local storage item
        dispatch({ type: 'CLEAR_CART' }); // Dispatch action to clear cart in Redux

        // Optional: Redirect after a delay or immediate
        const timer = setTimeout(() => {
            navigate('/'); // Redirect to home or desired page
        }, 3000); // Redirect after 3 seconds

        // Cleanup function to clear the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [dispatch, navigate]);

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <Result
                status="success"
                title="Payment Successful!"
                subTitle="Thank you for your payment. Your transaction has been completed."
                extra={[
                    <Button type="primary" key="console" onClick={() => navigate('/')}>
                        Go to Homepage
                    </Button>
                ]}
            />
        </div>
    );
};

export default Success;
