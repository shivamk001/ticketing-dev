import {useEffect, useState} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

const OrderShow=({order, currentUser })=>{
    const [timeLeft, setTimeLeft]=useState('');
    const { doRequest, errors}=useRequest({
        url: '/api/payments',
        method: 'post',
        body: {orderId: order.id},
        onSuccess: (payment)=>console.log(payment)
        
    })

    useEffect(()=>{
        const findTimeLeft=()=>{
            const msLeft=new Date(order.expiresAt)-new Date();

            setTimeLeft(Math.round(msLeft/1000));
        }

        findTimeLeft();
        const timerId=setInterval(findTimeLeft, 1000);

        return ()=>{
            clearInterval(timerId);
        }
    }, [order]);

    if(timeLeft<0){
        return <div>Order Expired</div>
    }

    return (
        <div>
            Time Left To Pay: {timeLeft} seconds
            <StripeCheckout
                token={(token)=>console.log(token)}
                stripeKey=''
                amount={order.ticket.price*1000}
                email={currentUser.email}
            />
            {errors}
        </div>);
}

OrderShow.getInitialProps=async (context, client)=>{
    const {orderId}=context.query;

    const {data}=await client.get(`/api/orders/${orderId}`);

    return { order: data};
}

export default OrderShow;