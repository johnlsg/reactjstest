import React, {useState} from "react";
import {
  Magnifier,
  GlassMagnifier,
  SideBySideMagnifier,
  PictureInPictureMagnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";
import './app.css'
const image = require('./image.jpg');
const image2 = require('./image2.PNG');
const imgCircle= require('./circle.png')
const image3 = require('./image3.jpg')





class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      marks:[],
      mx:0,
      my:0,
      imgSize:0
    };
  }

  ovl = (isZoom) =>{
    const handleClick = (e)=>{
      console.log("div clicked")
      console.log(e.clientX)
      console.log(e.clientY)
      console.log(e.pageX)
      console.log(e.pageY)
      const {offsetTop,offsetLeft} = document.getElementById("bodyMag")
      let x = e.pageX-offsetLeft
      let y = e.pageY-offsetTop
      console.log(x)
      console.log(y)
      let marker = this.state.marks.slice()
      const markId = marker.length
      marker.push({
        id:markId,
        x:x-5-3,
        y:y-5-3,
        isHide:false,
        offsetX:0,
        offSetY:0
      })
      this.setState({marks:marker})
    }

    const handleMove = (e)=>{
      const {offsetTop,offsetLeft,offsetWidth} = document.getElementById("bodyMag")
      let cursorX = e.pageX-offsetLeft
      let cursorY = e.pageY-offsetTop
      this.setState({mx:cursorX,my:cursorY})
      const newMarks = this.state.marks.map((val)=>{
        let dist = Math.pow((val.x+5) - (cursorX-3),2) + Math.pow((val.y+5)-(cursorY-3), 2)
        const magnifiedRange = (0.25*offsetWidth-6)/this.state.imgSize*offsetWidth
        if(dist< Math.pow(magnifiedRange/2,2)){
          const curX = cursorX-3
          const curY = cursorY-3
          const markX = val.x+5
          const markY = val.y+5
          // const magX = (50/7)*(markX-curX)
          // const magY = (50/7)*(markY-curY)
          const magX = (7.016)*(markX-curX)
          const magY = (7.016)*(markY-curY)
          const finalX = magX + curX
          const finalY = magY + curY
          const diffX = finalX - markX
          const diffY = finalY - markY
          return {...val, isHide:false, offsetX: diffX, offsetY: diffY}
        }else if( dist< Math.pow((0.5*0.25 * offsetWidth)+3,2)){
          return {...val,isHide:true, offsetX:0, offsetY:0}
        }
        return {...val,isHide:false, offsetX:0, offsetY:0}
      })
      this.setState({marks:newMarks})
    }
    const style = {
      "position":"absolute",
      "display":"block",
      "backgroundColor": "none",
      "zIndex":3,
      "left":"0px",
      "top":"0px",
      "opacity":"1",
      "width":"100%",
      "height":"100%"
    }
    return(
      <div style={style} onClick={handleClick} onMouseMove={handleMove}>
        <p>{this.state.mx},{this.state.my}</p>
        {this.state.marks.map((value)=>{
          const styleMark = {
            position:"absolute",
            top:value.y,
            left:value.x,
            width:"10px",
            display:(value.isHide)?"none":"block",
            transform:`translate(${value.offsetX}px,${value.offsetY}px)`
          }
          return <img key={value.id} src={imgCircle} style={styleMark}/>


        })}

      </div>
    )
  }

  render(){
    const style = {
      "position":"absolute",
      "width":"500px",
      "top":"100px",
      "left":"50px",
      "borderStyle":"solid",
      "overflow":"hidden"
    }
    return (
    <div id="bodyMag" style={style}>

      <GlassMagnifier
        imageSrc={image2}
        imageAlt="Example"
        renderOverlay={this.ovl}
        cursorStyle="crosshair"
        onImageLoad={(e)=>{this.setState({imgSize:e.target.naturalWidth})}}
      />
    </div>
    )
  }
}

export default App