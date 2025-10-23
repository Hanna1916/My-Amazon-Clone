import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import {img} from './img/data'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import classes from '../Carousel/Carousel.module.css'


function CarouselEffect() {
  return (
    <div>

      <Carousel
      autoPlay = {true}
      infiniteLoop = {true}
      showStatus = {false}
      showIndicators = {false}
      showThumbs = {false}
      interval = {2000}
      >

{
    img.map((imageItemLink)=>{
        return (
           <img key={imageItemLink} src={imageItemLink} />
        )
    })
}


        </Carousel>

    </div>
  )
}

export default CarouselEffect;