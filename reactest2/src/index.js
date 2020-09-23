import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

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
  const [isEdit, setEdit] = useState(false)

  // console.log(mark)
  return (
    <div>
      <button onClick={() => {
        setEdit((prev) => !prev)
      }}>{`Edit ${isEdit?"on":"off"}`}
      </button>
      <button
        onClick={()=>{
          setMark(mark.filter(()=>{
            return Math.random()>0.5
          }))
        }}
      >clear</button>
      <App
        style={{
          width: "500px",
          // border:"solid",
          // borderWidth:3,
        }}
        onChange={(newMark) => {
          setMark(newMark)
        }}
        onMarkClick={
          (markObj)=>{
            alert(markObj.hoverText)
          }
        }
        image={image2}
        markImg={imgSearch}
        marks={mark}
        editable={isEdit}
      />

    </div>
  )

}





ReactDOM.render(
  <TestParent/>, document.getElementById('root')
);

