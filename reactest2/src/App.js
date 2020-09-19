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
const imgSearch = require('./search.png')




class App extends React.Component{
  constructor(props) {
    super(props);
    const marks = props.marks ? props.marks.map((val)=>{
      return {
        ...val,
        isHide:false,
        offsetX:0,
        offSetY:0
      }

    }):[]
    this.state = {
      marks:marks,
      mx:0,
      my:0,
      imgSize:0
    };
  }



  ovl = (isZoom) =>{
    const handleClick = (e)=>{
      const {offsetTop,offsetLeft} = document.getElementById("bodyMag")
      let x = e.pageX-offsetLeft-this.props.markOffsetX-this.props.bodyMagBorderWidth
      let y = e.pageY-offsetTop-this.props.markOffsetY-this.props.bodyMagBorderWidth
      let marker = this.state.marks.slice()
      // const markId = marker.length
      marker.push({
        // id:markId,
        x:x,
        y:y,
        hoverText:`This is mark ${x}, ${y}`,
        isHide:false,
        offsetX:0,
        offSetY:0
      })
      this.setState({marks:marker})
    }

    const handleMove = (e)=>{
      const {offsetTop,offsetLeft,offsetWidth} = document.getElementById("bodyMag")
      let cursorX = e.pageX-offsetLeft-this.props.bodyMagBorderWidth
      let cursorY = e.pageY-offsetTop-this.props.bodyMagBorderWidth
      this.setState({mx:cursorX,my:cursorY})
      const newMarks = this.state.marks.map((val)=>{
        const markAnchorX = val.x+this.props.markOffsetX
        const markAnchorY = val.y+this.props.markOffsetY
        const dist = Math.pow((markAnchorX) - (cursorX),2) + Math.pow((markAnchorY)-(cursorY), 2)
        // magnifiedRange = glassMagnifierSizeInPercent * offsetWidth - 2*glassMagnifierBorderWidth
        const magnifiedRange = (0.25*offsetWidth-6)/this.state.imgSize*offsetWidth
        const magnifyRate = this.state.imgSize/offsetWidth
        if(dist< Math.pow(magnifiedRange/2,2)){
          const curX = cursorX
          const curY = cursorY
          const magX = (magnifyRate)*(markAnchorX-curX)
          const magY = (magnifyRate)*(markAnchorY-curY)
          const finalX = magX + curX
          const finalY = magY + curY
          const diffX = finalX - markAnchorX
          const diffY = finalY - markAnchorY
          return {...val, isHide:false, offsetX: diffX, offsetY: diffY}
        }else if( dist< Math.pow((0.5*0.25 * offsetWidth)+3,2)){
          return {...val,isHide:true, offsetX:0, offsetY:0}
        }
        return {...val,isHide:false, offsetX:0, offsetY:0}
      })
      this.setState({marks:newMarks})
    }
    const style = {
      position:"absolute",
      display:"block",
      backgroundColor: "none",
      zIndex:3,
      left:"0px",
      top:"0px",
      width:"100%",
      height:"100%"
    }
    return(
      <div style={style} onClick={handleClick} onMouseMove={handleMove}>
        <p>{this.state.mx},{this.state.my}</p>
        {this.state.marks.map((value)=>{
          const styleMark = {
            width:this.props.markWidth,
            height:this.props.markHeight,
            display:"inherit",
            opacity:"inherit",
          }
          const styleMarkDiv = {
            position:"absolute",
            top:value.y,
            left:value.x,
            display:(value.isHide)?"none":"block",
            opacity:".75",
            transform:`translate(${value.offsetX}px,${value.offsetY}px)`,
            textAlign:"center",
          }
          const styleMarkHoverTxt = {
            position:"absolute",
            display:"inline-block",
            transform: "translate(-50%, -110%)",
            minWidth:"150px"
          }

          return (
            <div className="markDiv" key={value.x*value.y} style={styleMarkDiv} onMouseOver={()=>{console.log("icon hovered")}}>
              <div className="hoverTxt" style={styleMarkHoverTxt}>
                {value.hoverText}
              </div>
              <img src={imgSearch} style={styleMark} onClick={(e)=>{e.stopPropagation(); console.log(value.id+" clicked")}}/>
            </div>
            )


        })}

      </div>
    )
  }

  render(){
    const style = {
      position:"absolute",
      width:"500px",
      borderStyle:"solid",
      borderWidth:this.props.bodyMagBorderWidth,
      overflow:"hidden"
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

App.defaultProps = {
  "bodyMagBorderWidth":3,
  "markOffsetX":25,
  "markOffsetY":25,
  "markHeight":50,
  "markWidth":50,
  "marks":[
    {x:105,y:342,hoverText:"Hand"},
    {x:181,y:424,hoverText:"Leg"},
    {x:166,y:209,hoverText:"Arm"},
    {x:230,y:260,hoverText:"Abdomen"},
    {x:233,y:175,hoverText:"Chest"},
    {x:225,y:75,hoverText:"Face"}
  ]
}

export default App