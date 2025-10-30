import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Landing from './pages/Landing/Landing'
import Auth from "./pages/Auth/Auth";
import Payment from './pages/Payment/Payment'
import Orders from './pages/Orders/Orders'
import Cart from './pages/Cart/Cart'
import Results from './pages/Results/Results'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import ProtectRoute from "./Components/ProtectedRoute/ProtectedRoute"

const stripePromise = loadStripe('pk_test_51SB2Y88Rswsty7NihCq4hsc1hqQlArRwOhXvibHN4NfJsBUQcxg8qBSP4wGS52fuyQUnIQS8AW75zDhASAcjGvbU00iySrAC6j'
);
function Routing() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Landing/>}/>
           <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={
              <ProtectRoute msg={"you must login to pay"}
              redirect={"/checkout"}>
            <Elements stripe={stripePromise}>
                 <Payment />
              </Elements>
              </ProtectRoute>
             
              } />
            <Route path="/orders" element={
              <ProtectRoute msg={"you must login to access your order"} redirect={"/orders"}>
                <Orders />
              </ProtectRoute>
            } />
              
             <Route path="/category/:categoryName" element={<Results/>}/>
             <Route path="/products/:productId" element ={<ProductDetail/>} />
             <Route path="/cart" element={<Cart />} />
        </Routes>
   </Router>
  )
}

export default Routing;




