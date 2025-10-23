

import React from "react";
import { Link } from "react-router-dom";
import classes from "./CategoryCard.module.css";

 

function CategoryCard({ data }) {
  return (
    <div className={classes.category}>
<Link to={`/category/${data.category}`}>

      {/* <Link to={`/category/${data.name}`}> */}
     <span>
<h2>{data?.category}</h2>
     </span>
        
        <img src={data.image} alt="data.category"/>
         
        <p>Shop Now</p>
      </Link>
      </div>
  );
}

export default CategoryCard;

