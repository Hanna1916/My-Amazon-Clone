

import React,{useContext} from "react";
import { GoLocation } from "react-icons/go";
import { BsSearch } from "react-icons/bs";
import { BiCart } from "react-icons/bi";
import classes from "./Header.module.css";
import {Link} from 'react-router-dom'
import LowerHeader from "./LowerHeader";
import { DataContext } from "../DataProvider/DataProvider";
import {auth} from '../../Utility/Firebase'


function Header() {

const [{user,basket},dispatch] = useContext(DataContext)

const totalItems = basket?.reduce((amount,item)=> {
  return item.amount + amount
},0)
  return (
    <section className={classes.fixed}>
      <div className={classes.header__container}>
        {/* logo + delivery */}
        <section>
          <div className={classes.logo_container}>
            <Link to = {"/"}>
              <img
                src="https://pngimg.com/uploads/amazon/small/amazon_PNG25.png"
                alt="amazon logo"
              />
            </Link>
  

            <div className={classes.delivery}>
              <span>
                <GoLocation />
              </span>
              <div>
                <p>Deliver to</p>
                <span>Frederick, MD 21704</span>
              </div>
            </div>
          </div>
        </section>

        {/* search  */}
        <div className={classes.search}>
          <select>
            <option value="all">All</option>
          </select>
          <input type="text" />
          <BsSearch size={25} />
        </div>

        {/* other section */}
        <div className={classes.order_container}>
          <Link to ="#" className={classes.language}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png?20240524035322"
              alt="US Flag"
            />
            <select>
              <option value="en">En</option>
            </select>
          </Link>

         <Link to= {!user && "/auth"} className={classes.signin}>
         
         <div>

          {
            user ? (
              <>
                <p>Hello, {user?.email?.split('@')[0]}</p>
                <span onClick ={() => auth.signOut()}>Sign Out</span>
              </>
            ) : (
              <>
                <p>Hello, Sign in</p>
                <span>Account & Lists</span>
              </>
            )
          }
       </div>
        </Link>
 <Link to ="/orders">
            <p>Returns</p>
            <span>& Orders</span>
          </Link>

          <Link to ="/cart" className={classes.cart}>
            <BiCart size={35} />
            <span>{totalItems}</span>
          </Link>
        </div>
      </div>
      <LowerHeader />
    </section>
  );
}

export default Header;
