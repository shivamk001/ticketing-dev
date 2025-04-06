import {useEffect, useState} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import { Router } from 'next/router';
import axios from 'axios';

const OrderShow=({order, currentUser })=>{
    const [timeLeft, setTimeLeft]=useState(0);
    const { doRequest, errors}=useRequest({
        url: '/api/payments',
        method: 'post',
        body: {orderId: order.id},
        onSuccess: ()=>Router.push('/orders')
        
    })
    console.log('ORDER:', order);
    
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
                stripeKey='pk_test_51R1sEPQhtnniCyXlopKdmCdIjBOAF48mJSy2wD12JTM24tSrq8yv1yFkAPUfESpxHos575hEIbArVYsxIxF5pxkt00gM0EmaC0'
                amount={order.ticket.price*1000}
                email={currentUser.email}
            />
            {errors}
        </div>);
}

OrderShow.getInitialProps=async (context, client)=>{
    const {orderId}=context.query;
    console.log('ORDERID:', orderId);
    // const {data}=await client.get(`/api/orders/${orderId}`);
    const baseURL=typeof window=='undefined'?process.env.ORDER_SERVICE_URL:'';
    console.log('ORDERID BASEURL:', baseURL);
    

    try{
        let {data}=axios.get(`${baseURL}/api/orders/${orderId}`);
        console.log('ORDERID DATA:', data);
        
        return { order: data};
    }
    catch(err){
        console.error('Error when fetching order:', err);
        return { order: {}};
    }
}

export default OrderShow;