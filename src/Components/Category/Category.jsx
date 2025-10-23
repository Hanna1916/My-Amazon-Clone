

import React from "react";
import productsInfo from "./CategoryInfos";
import CategoryCard from "./CategoryCard";
import classes from "./Category.module.css"; 

function Category() {
  return (
    <section className={classes.container}>
      {productsInfo.map((infos) => (
        <CategoryCard key={infos.id} data={infos} />
      ))}
    </section>
  );
}

export default Category;


