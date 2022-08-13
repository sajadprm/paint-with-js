const canvas = document.getElementById("canvas");
const canvasOverlay = document.getElementById("canvasOverlay");
const ctx = canvas.getContext("2d");
const ctxOverlay = canvasOverlay.getContext("2d");
const state = {
  drawMode: false,
  drawTool: "pen",
  color: "blue",
  backgroundColor: "#fff",
  startPoint:[0,0],
  lineWidth:1

}
fixedCanvasSize();



//events
canvasOverlay.addEventListener("mousemove", (e) => {
  const {startPoint}=state;
  if(state.drawMode)
  {
    switch(state.drawTool)
    {

      case "circle":
        ctxOverlay.beginPath();
        ctxOverlay.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
        [rx,ry]=[(e.clientX-startPoint[0])/2,(e.clientY-startPoint[1])/2]
        ctxOverlay.ellipse(startPoint[0]+rx, startPoint[1]+ry,Math.abs(rx),Math.abs(ry), 0, 0, Math.PI * 2);
        ctxOverlay.stroke()
       
        break;
        case "polygon":
          ctxOverlay.beginPath();
          ctxOverlay.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
     
          ctxOverlay.moveTo(...startPoint);    
          ctxOverlay.lineTo(e.clientX, e.clientY);  
          ctxOverlay.stroke();     
        break;
        case "eraser":
          ctxOverlay.beginPath();
        ctxOverlay.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
        ctxOverlay.ellipse(e.clientX, e.clientY,state.lineWidth,state.lineWidth, 0, 0, Math.PI * 2);
        ctxOverlay.stroke();
        ctxOverlay.strokeStyle="black";
        ctxOverlay.lineWidth=1;
        ctx.strokeStyle=state.backgroundColor;
        drawPoint(e.clientX, e.clientY);
          break
        default:
           drawPoint(e.clientX, e.clientY);
        
    }
  }
  

 
})
canvasOverlay.addEventListener("mousedown", (e) => {
  state.startPoint=[e.clientX,e.clientY];
  state.drawMode = true;

  switch(state.drawTool)
  {
    case "polygon":
      ctx.drawImage(canvasOverlay, 0, 0);
      ctxOverlay.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
      break;
  }
})
document.body.addEventListener("mouseup", (e) => {
  
  ctx.beginPath();
  switch(state.drawTool)
  {
      case "circle":
        ctx.drawImage(canvasOverlay, 0, 0);
      ctxOverlay.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
      case "pen":
        state.drawMode = false;
        break;
        case "eraser":
          ctxOverlay.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
          ctx.strokeStyle=state.color;
          ctxOverlay.strokeStyle=state.color;
          ctxOverlay.lineWidth=state.lineWidth;
        
          break;


  }


})

//select color
document.querySelectorAll("#colorsPallet div").forEach(($colorEl) => {
  $colorEl.addEventListener("click", (event) => {

    

    state.color=$colorEl.style.backgroundColor;
    applyColor();
    document.querySelector(".colors.slected").className = "colors";
    $colorEl.className = "colors slected";

  })
})

document.querySelector("#customColor input").addEventListener("change",(e)=>{
  const customColorElement=document.getElementById("customColor");
  state.color=e.target.value;
  customColorElement.style.backgroundColor=state.color;
  const {r,g,b}=hexToRgb(state.color);
   customColorElement.style.color=`rgba(${r},${g},${b},0.6)`;
   customColorElement.color=hexToRgb()
   applyColor();
    document.querySelector(".colors.slected").className = "colors";
    customColorElement.className = "colors slected";
    document.body.focus();

});
document.getElementById("lineWidth").addEventListener("change",e=>{
  state.lineWidth=+e.target.value;
  console.log(state.lineWidth);
  ctxOverlay.lineWidth=state.lineWidth;
  ctx.lineWidth=state.lineWidth;
})

//select tool
document.querySelectorAll("button").forEach(($toolEl) => {
  $toolEl.addEventListener("click", (event) => {

    state.drawMode = false;
    ctxOverlay.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);

    


    document.querySelector("button.selected").className = document.querySelector("button.selected").className.replace("selected", "");
    $toolEl.className = $toolEl.className + " selected";
    state.drawTool = $toolEl.id

  })
})

document.getElementById("sinWave").addEventListener("click",(e)=>{

ctx.moveTo(50,50);
ctx.bezierCurveTo(120,-100,200,250,250,50);
ctx.bezierCurveTo(300,-100,350,250,430,50);
ctx.lineWidth = state.lineWidth;
ctx.strokeStyle = state.color;
ctx.stroke();
})
//resize window
window.addEventListener('resize', fixedCanvasSize);

//select clear page
document.getElementById("clear").addEventListener("click", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

})

//eraser
document.getElementById("eraser").addEventListener("click", (e) => {
  state.drawTool="eraser";
  ctx.fillStyle=state.backgroundColor;
  

})



//functions 
const drawPoint = (x, y) => {
  ctx.arc(x, y, 0, 0, 0);

  ctx.stroke()


}

function fixedCanvasSize() {
  const {width, height} = canvas.getBoundingClientRect();
  // create a temporary canvas obj to cache the pixel data //
  const temp_cnvs = document.createElement('canvas');
  const temp_cntx = temp_cnvs.getContext('2d');
  // set it to the new width & height and draw the current canvas data into it // 
  temp_cnvs.width = width;
  temp_cnvs.height = height;
  temp_cntx.fillStyle = state.backgroundColor // the original canvas's background color
  temp_cntx.fillRect(0, 0, width, height);
  temp_cntx.drawImage(canvas, 0, 0);
  // resize & clear the original canvas and copy back in the cached pixel data //
  canvas.width = width;
  canvas.height = height;
  canvasOverlay.width=width;
  canvasOverlay.height=height;
  ctx.drawImage(temp_cnvs, 0, 0);
  applyColor();
}
function applyColor()
{
  ctx.strokeStyle = state.color;
  ctxOverlay.strokeStyle = state.color;
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function cursorFromFont(unicede)
{
  var canvas = document.createElement("canvas");
  canvas.width = 24;
  canvas.height = 24;
  //document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.font = "24px FontAwesome";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("\uf002", 12, 12);
  const dataURL = canvas.toDataURL('image/png')
  return dataURL;
}



