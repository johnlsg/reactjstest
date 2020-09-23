import React, {createRef} from "react";
import {GlassMagnifier,} from "react-image-magnifiers";
import './imageMagnifier.css'


class ImageMagnifier extends React.Component{
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

  overlay = () =>{
    const markOffsetX = this.props.markOffsetX?this.props.markOffsetX:this.props.markHeight*-0.5
    const markOffsetY = this.props.markOffsetY?this.props.markOffsetY:this.props.markWidth*-0.5
    let borderWidth, offsetTop, offsetLeft, offsetWidth
    if(this.elemMainDiv.current){
      borderWidth = Number(this.elemMainDiv.current.style.borderWidth.slice(0,-2))
      offsetTop= this.elemMainDiv.current.offsetTop
      offsetLeft= this.elemMainDiv.current.offsetLeft
      offsetWidth = this.elemMainDiv.current.offsetWidth
    }

    const handleClick = (e)=>{
      let x = e.pageX-offsetLeft+markOffsetX-borderWidth
      let y = e.pageY-offsetTop+markOffsetY-borderWidth
      this.props.onClick(x, y)
    }

    const handleMove = (e)=>{
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
          const magX = (magnifyRate)*(markAnchorX-cursorX)
          const magY = (magnifyRate)*(markAnchorY-cursorY)
          const finalX = magX + cursorX
          const finalY = magY + cursorY
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
                   }}
                   alt="Mark"
              />
            </div>
            )
        })}

      </div>
    )
  }

  cmpMark = (propMark, stateMark)=>{
    return propMark.x === stateMark.x && propMark.y === stateMark.y && propMark.hoverText === stateMark.hoverText;

  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(nextProps.marks)
    if (!nextProps.marks) {
      console.log("markArr null undefined")
      this.setState({marks: []})
      return
    }
    if (nextProps.marks.length !== this.state.marks.length) {
      let marks
      if (nextProps.marks.length > this.state.marks.length) {
        marks = nextProps.marks.map((val) => {
          for(let i=0; i<this.state.marks.length;i++){
            if(this.cmpMark(val, this.state.marks[i])){
              const obj = this.state.marks[i]
              return {
                ...val,
                isHide: obj.isHide,
                offsetX: obj.offsetX,
                offSetY: obj.offsetY
              }
            }
          }
            return {
              ...val,
              isHide: false,
              offsetX: 0,
              offSetY: 0
            }

        })
      }else{
        marks = this.state.marks.filter((val)=>{
          for(let i=0; i<nextProps.marks.length;i++){
             if(this.cmpMark(nextProps.marks[i], val)){
               return true
             }
          }
          return false
        })
      }
      this.setState({marks: marks})
    }
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
"onClick": callback function, pass coordinate of point clicked, relative to elemMainDiv (the outermost <div> in this component) not including its border
function onClickHandler(x, y){
  //your code
}
"onMarkClick": callback function, pass object of mark being clicked, fire when mark clicked
function onMarkClickHandler(markObj){
  //your code
}
*/
ImageMagnifier.defaultProps = {
  "markHeight":50,
  "markWidth":50,
  "magnifyRate":2,
  "editable":false,
  "onClick":()=>{},
  "onMarkClick":()=>{},
  "imgAlt":"Image",
}

export default ImageMagnifier