// import React, { useContext } from 'react'
// import LayOut from '../../Components/LayOut/LayOut'
// import { DataContext } from '../../Components/DataProvider/DataProvider';
// import ProductCard from '../../Components/Product/ProductCard';
// import { Link } from 'react-router-dom';
// import CurrencyFormat from '../../Components/CurrencyFormat/CurrencyFormat';
// import classes from './Cart.module.css'
// import { Type } from '../../Utility/action.type';
// import { IoIosArrowDown } from "react-icons/io";
// import { IoIosArrowUp } from "react-icons/io";

// function Cart() {
//   const [{basket,user},dispatch] = useContext(DataContext);
//   const total = basket.reduce((amount,item)=>{
//     return item.price * item.amount + amount
//   },0)
//   const increment = (item) =>{
//     dispatch({
//       type: Type.ADD_TO_BASKET,
//       item
//     })
//   }
//   const decrement = (id) =>{
//     dispatch({
//       type: Type.REMOVE_FROM_BASKET,
//       id
//     })
//   }
//   return (
//     <LayOut>
//     <section className={classes.container}>
//    <div className={classes.cart_container}>
//   <h2>Hello</h2>
//   <h3>your shopping basket</h3>
//   <hr/>

//   {

//     basket?.length === 0 ? (<p> Opps ! Your basket is empty</p>) : (
//       basket?.map((item,i) => {
//         return  <section className={classes.cart_product}>

//         <ProductCard
//         key = {i}
//         product = {item}
//         renderAdd={false}
//         renderDesc = {true}
//         flex = {true}

//         />;
//         <div className={classes.btn_container}>
//         <button className={classes.btn} onClick={()=>increment(item)}>
//           <IoIosArrowUp size={20} />
//         </button>
//         <span>{item.amount}</span>
//         <button className={classes.btn} onClick={()=>decrement(item.id)}>
//           <IoIosArrowDown size={20} />
//         </button>
//         </div>
//         </section>
//       })
//     )
// }
// </div>

//   {basket?.length !==0 && (
//     <div className={classes.subtotal}>
//      <div>
//       <p>Your total is:({basket?.length}item)</p>
//       <CurrencyFormat amount ={total} />
//       </div>
//       <span>
//         <input type='checkbox'/>
//         <small>This is a gift wrap</small>
//       </span>
//       <Link to='/checkout'>Proceed to Checkout</Link>
//       </div>
//     )}
//     </section>
//     </LayOut>

//   )
// }
// export default Cart

import React, { useContext } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { Link } from "react-router-dom";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import classes from "./Cart.module.css";
import { Type } from "../../Utility/action.type";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function Cart() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);
  const increment = (item) => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item,
    });
  };
  const decrement = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id,
    });
  };
  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.cart_container}>
          <h2>Hello</h2>
          <h3>your shopping basket</h3>
          <hr />

          {basket?.length === 0 ? (
            <p> Opps ! Your basket is empty</p>
          ) : (
            basket?.map((item, i) => {
              return (
                <section className={classes.cart_product}>
                  <ProductCard
                    key={i}
                    product={item}
                    renderAdd={false}
                    renderDesc={true}
                    flex={true}
                  />
                  ;
                  <div className={classes.btn_container}>
                    <button
                      className={classes.btn}
                      onClick={() => increment(item)}
                    >
                      <IoIosArrowUp size={20} />
                    </button>
                    <span>{item.amount}</span>
                    <button
                      className={classes.btn}
                      onClick={() => decrement(item.id)}
                    >
                      <IoIosArrowDown size={20} />
                    </button>
                  </div>
                </section>
              );
            })
          )}
        </div>

        {basket?.length !== 0 && (
          <div className={classes.subtotal}>
            <div>
              <p>Your total is:({basket?.length}item)</p>
              <CurrencyFormat amount={total} />
            </div>
            <span>
              <input type="checkbox" />
              <small>This is a gift wrap</small>
            </span>
            {/* ✅ FIX: Change /checkout to /payment */}
            <Link to="/payment">Proceed to Checkout</Link>
          </div>
        )}

// Add this temporary debug function in your Payment component
const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase connection...');
  console.log('db object:', db);
  console.log('db.collection type:', typeof db?.collection);
  console.log('User UID:', user?.uid);
  
  try {
    // Test if we can write to Firestore
    const testRef = await db.collection('test').add({
      test: true,
      timestamp: new Date(),
      userId: user?.uid
    });
    console.log('✅ Test document written with ID:', testRef.id);
    
    // Try to read it back
    const doc = await testRef.get();
    console.log('✅ Test document read back:', doc.data());
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
  }
};

// Call this when component mounts or add a test button
// useEffect(() => {
//   testFirebaseConnection();
// }, []);

      </section>
    </LayOut>
  );
}
export default Cart;
