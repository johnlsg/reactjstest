import React, {createRef} from "react";
import {
  GlassMagnifier,
} from "react-image-magnifiers";
import './app.css'





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
      largeTmgWidth:0,
      markOffsetX:this.props.markOffsetX?this.props.markOffsetX:this.props.markHeight*-0.5,
      markOffsetY:this.props.markOffsetY?this.props.markOffsetY:this.props.markWidth*-0.5,
    };
  }

  elemMainDiv = createRef();

  overlay = (isZoom) =>{
    const handleClick = (e)=>{
      if(!this.props.editable){
        return;
      }
      const {offsetTop,offsetLeft} = this.elemMainDiv.current
      const borderWidth = Number(this.elemMainDiv.current.style.borderWidth.slice(0,-2))
      let x = e.pageX-offsetLeft+this.state.markOffsetX-borderWidth
      let y = e.pageY-offsetTop+this.state.markOffsetY-borderWidth
      let marker = this.state.marks.slice()
      marker.push({
        // id:markId,
        x:x,
        y:y,
        hoverText:`This is mark ${x}, ${y}`,
        isHide:false,
        offsetX:0,
        offSetY:0
      })
      this.props.onChange(marker)
      // this.setState({marks:marker})
    }

    const handleMove = (e)=>{
      const {offsetTop,offsetLeft,offsetWidth} = this.elemMainDiv.current
      const borderWidth = Number(this.elemMainDiv.current.style.borderWidth.slice(0,-2))
      let cursorX = e.pageX-offsetLeft-borderWidth
      let cursorY = e.pageY-offsetTop-borderWidth
      this.setState({mx:cursorX,my:cursorY})
      const newMarks = this.state.marks.map((val)=>{
        const markAnchorX = val.x-this.state.markOffsetX
        const markAnchorY = val.y-this.state.markOffsetY
        const dist = Math.pow((markAnchorX) - (cursorX),2) + Math.pow((markAnchorY)-(cursorY), 2)
        // magnifiedRange = (glassMagnifierSizeInPercent * offsetWidth - 2*glassMagnifierBorderWidth)/largeImgWidth*mainDivWidth
        const magnifiedRange = (0.25*offsetWidth-6)/this.state.largeImgWidth*offsetWidth
        const magnifyRate = this.state.largeImgWidth/offsetWidth
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
        {this.state.marks.map((value,index)=>{
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
            <div className="markDiv" key={index} style={styleMarkDiv}>
              <div className="hoverTxt" style={styleMarkHoverTxt}>
                {value.hoverText}
              </div>
              <img src={this.props.markImg}
                   style={styleMark}
                   onClick={(e)=>{
                     e.stopPropagation();
                     const markObj = this.state.marks[index]
                     this.props.onMarkClick({
                       x:markObj.x,
                       y:markObj.y,
                       hoverText:markObj.hoverText
                     })
                     // console.log(`${value.x} ${value.y} ${index} clicked`)
                   }}
                   alt="Mark"
              />
            </div>
            )
        })}

      </div>
    )
  }

  render(){
    const style = {
      overflow:"hidden",
      ...this.props.style,
    }
    return (
    <div style={style} ref={this.elemMainDiv}>

      <GlassMagnifier
        imageSrc={this.props.image}
        renderOverlay={this.overlay}
        cursorStyle="crosshair"
        onImageLoad={(e)=>{
            if(this.props.magnifyRate){
              this.setState({largeImgWidth:`${this.elemMainDiv.current.offsetWidth*this.props.magnifyRate}`})
            }else{
              this.setState({largeImgWidth:e.target.naturalWidth})
            }
          }
        }
        onLargeImageLoad={(e)=>{
            if(this.props.magnifyRate){
              e.target.style.width=`${this.elemMainDiv.current.offsetWidth*this.props.magnifyRate}px`;
            }
          }
        }
        imgAlt={this.props.imgAlt}
      />
    </div>
    )
  }
}
/*
Props
"image": image to be shown and magnified
"markImg": image to be used as marker
"markHeight": Mark height
"markWidth": Mark Width
"markOffsetX": Offset marks in x axis, default to half of mark width
"markOffsetY": Offset marks in y axis, default to half of mark height
"magnifyRate": Rate of magnification to the image
"marks": array with objects initializing marks on image
[
{x: #x coordinate of mark, y: #y corrdinate of mark, hoverText: #Text to be shown when cursor hover the mark},
...
]
"editable":boolean, enable/disable addition of mark
"onChange": callback function, pass new mark array as parameter, fire when new mark is added
function onChangeHandler(newMarkArray){
  //your code
}
"onMarkClick": callback function, pass object of mark being clicked, fire when mark clicked
function onMarkClickHandler(markObj){
  //your code
}
*/
App.defaultProps = {
  "markHeight":50,
  "markWidth":50,
  "magnifyRate":2,
  "editable":false,
  "onChange":()=>{},
  "onMarkClick":()=>{},
  "imgAlt":"Image",
}

export default App