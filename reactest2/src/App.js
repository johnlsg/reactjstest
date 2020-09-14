import React, {useState} from "react";
import {
  Magnifier,
  GlassMagnifier,
  SideBySideMagnifier,
  PictureInPictureMagnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";
const image = require('./image.jpg');
const image2 = require('./image2.PNG');
const image3= require('./circle.png')




const ovl = (isZoom) =>{

  const handleClick = (e)=>{
    e.persist()
    console.log("clicked")
    console.log(e)
  }
  const handleEnter = (e)=>{
    e.target.style.opacity="1"

  }
  const handleExit = (e)=>{
    e.target.style.opacity="1"
  }
  const style = {
    "position":"absolute",
    "display":"block",
    "backgroundColor": "none",
    "zIndex":3,
    "left":"260px",
    "top":"50px",
    "opacity":"1"
  }
  return(
    <div style={style} onClick={handleClick} onMouseEnter={handleEnter} onMouseLeave={handleExit}>
      <img src={image3} width="30px"/>
    </div>
  )
}

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
  }


  render(){
    const handleClick = (e)=>{
      console.log("div clicked")
      console.log(e.clientX)
      console.log(e.clientY)
      console.log(e.pageX)
      console.log(e.pageY)
      const {offsetTop,offsetLeft} = document.getElementById("bodyMag")
      console.log(e.pageX-offsetLeft)
      console.log(e.pageY-offsetTop)
    }
    const style = {
      "position":"absolute",
      "width":"500px",
      "top":"100px",
      "left":"50px",
      "border-style":"solid"
    }
    return (
    <div id="bodyMag" style={style} onClick={handleClick}>

      <GlassMagnifier
        imageSrc={image2}
        imageAlt="Example"
        renderOverlay={ovl}
        cursorStyle="crosshair"
      />
    </div>
    )
  }
}

export default App