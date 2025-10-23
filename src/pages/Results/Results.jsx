
// import React, { useEffect, useState } from 'react'
// import classes from './Results.module.css'
// import LayOut from '../../Components/LayOut/LayOut'
// import { useParams } from 'react-router-dom'
// import axios from 'axios'
// import { productUrl } from '../../Api/endPoints'
// import ProductCard from '../../Components/Product/ProductCard'


// function Results() {
//   const [results, setResults] = useState([])
//   const [isLoading, setIsLoading] =useState(false)
//   const {categoryName} =useParams()
// useEffect(() => {
//   axios.get(`${productUrl}/products/category/${categoryName}`)

//     .then((res) => {
//       setResults(res.data)
//       isLoading(false)
//     }).catch((err) => {
//       console.log(err);
//       isLoading(false)
//     })
// }, [])
//   return (
//     <LayOut>
// <section>
// <h1 style={{ padding:"30px"}}>Results</h1>
// <p style={{padding:"30px"}}>Category /{categoryName}</p>
// <hr/>
// {
//   isLoading?(<Loder/>):(
// <div className={classes.products_container}>
//   {results?.map((product) =>(
//     <ProductCard
//     key={product.id}
//     product={product} />

//   ))}

// </div>
//   )
// }

// </section>
//     </LayOut>
    
//   )
// }

// export default Results

import React, { useEffect, useState } from 'react'
import classes from './Results.module.css'
import LayOut from '../../Components/LayOut/LayOut'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { productUrl } from '../../Api/endPoints'
import ProductCard from '../../Components/Product/ProductCard'
import Loader from '../../Components/Loader/Loader'

function Results() {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { categoryName } = useParams()

  useEffect(() => {
    if (!categoryName) return
    const base = productUrl.replace(/\/$/, '') // normalize trailing slash
    setIsLoading(true)

    axios
      .get(`${base}/products/category/${encodeURIComponent(categoryName)}`)
      .then((res) => {
        setResults(res.data || [])
      })
      .catch((err) => {
        console.error('Fetch products error:', err)
        setResults([])
      })
      .finally(() => setIsLoading(false))
  }, [categoryName])

  return (
    <LayOut>
      <section>
        <h1 style={{ padding: '30px' }}>Results</h1>
        <p style={{ padding: '30px' }}>Category / {categoryName}</p>
        <hr />

        {isLoading ? (
          <Loader />
        ) : results.length ? (
          <div className={classes.products_container}>
            {results.map((product) => (
              <ProductCard key={product.id || product._id} product={product}
              renderAdd={true} />
            ))}
          </div>
        ) : (
          <p style={{ padding: '30px' }}>No products found.</p>
        )}
      </section>
    </LayOut>
  )
}

export default Results


