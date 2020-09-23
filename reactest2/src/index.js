import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import ImageMagnifier from './ImageMagnifier'

const image2 = require('./image2.PNG');
const imgSearch = require('./search.png')

// ========================================

const TestParent = ()=>{

  const [mark, setMark] = useState([
    {x:105,y:342,hoverText:"Hand"},
    {x:181,y:424,hoverText:"Leg"},
    {x:166,y:209,hoverText:"Arm"},
    {x:230,y:260,hoverText:"Abdomen"},
    {x:233,y:175,hoverText:"Chest"},
    {x:225,y:75,hoverText:"Face"}
  ])

  // console.log(mark)
  return (
    <div>
      <button
        onClick={()=>{
          setMark(mark.filter(()=>{
            return Math.random()>0.2
          }))
        }}
      >clear random marks</button>

      <ImageMagnifier
        style={{
          width: "500px",
          // border:"solid",
          // borderWidth:3,
        }}
        onClick={(x,y) => {
          let marker = mark.slice()
          marker.push({
            x:x,
            y:y,
            hoverText:`This is mark ${x}, ${y}`,
          })
          setMark(marker)
        }}
        onMarkClick={
          (markObj)=>{
            alert(markObj.hoverText)
          }
        }
        image={image2}
        markImg={imgSearch}
        marks={mark}
      />

    </div>
  )

}





ReactDOM.render(
  <TestParent/>, document.getElementById('root')
);

