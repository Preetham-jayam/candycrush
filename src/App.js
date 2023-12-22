import { useState, useEffect } from "react";
import blueCandy from './assets/blue-candy.png'
import redCandy from './assets/red-candy.png';
import yellowCandy from './assets/yellow-candy.png';
import greenCandy from './assets/green-candy.png';
import purpleCandy from './assets/purple-candy.png';
import orangeCandy from './assets/orange-candy.png';
import blankCandy from './assets/blank.png';
import ScoreBoard from "./components/ScoreBoard";
const width = 8;
const candyColours = [blueCandy, orangeCandy, redCandy, purpleCandy, greenCandy, yellowCandy];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingReplaced,setSquareBeingReplaced]=useState(null);
  const [score,setScore]=useState(0);
  const [squareBeingDragged,setSquareBeingDragged]=useState(null);

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank=currentColorArrangement[i]===blankCandy
      if (
        columnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) && !isBlank
      ) {
        setScore((score)=>score+3 );
        columnOfThree.forEach((square) => {
          currentColorArrangement[square] = blankCandy;
        });

        return true;

      }
    }
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2,i+width*3];
      const decidedColor = currentColorArrangement[i];
      const isBlank=currentColorArrangement[i]===blankCandy

      if (
        columnOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) && !isBlank
      ) {
        setScore((score)=>score+4 );
        columnOfFour.forEach((square) => {
          currentColorArrangement[square] = blankCandy;
        });
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64];
      const isBlank=currentColorArrangement[i]===blankCandy
      if(notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) && !isBlank
      ) {
        setScore((score)=>score+3 );
        rowOfThree.forEach((square) => {
          currentColorArrangement[square] = blankCandy;
        });
        return true;
      }

    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i+3];
      const decidedColor = currentColorArrangement[i];
      const notValid=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64];
      const isBlank=currentColorArrangement[i]===blankCandy
      if(notValid.includes(i)) continue;
      if (
        rowOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        ) && !isBlank
      ) {
        setScore((score)=>score+4 );
        rowOfFour.forEach((square) => {
          currentColorArrangement[square] = blankCandy;
        });
        return true;
      }
    }
  };

  const moveIntoSquaresBelow=()=>{


    for(let i=0;i<=55;i++){
      const firstrow=[0,1,2,3,4,5,6,7];
      const isFirstRow=firstrow.includes(i);

      if(isFirstRow && currentColorArrangement[i]===blankCandy){
       let color= Math.floor(Math.random()*candyColours.length);
       currentColorArrangement[i]=candyColours[color];
      }
      if((currentColorArrangement[i+width] ===blankCandy)){
        currentColorArrangement[i+width]=currentColorArrangement[i];
        currentColorArrangement[i]=blankCandy;
      }
    }

  }

  const dragstart=(e)=>{
    setSquareBeingDragged(e.target);


  };
  const dragdrop=(e)=>{
    setSquareBeingReplaced(e.target);


  };
  const dragend=(e)=>{
    const draggedId=parseInt(squareBeingDragged.getAttribute('data-id'));
    const replacedId=parseInt(squareBeingReplaced.getAttribute('data-id'));

    currentColorArrangement[draggedId]=squareBeingReplaced.getAttribute('src');
    currentColorArrangement[replacedId]=squareBeingDragged.getAttribute('src');

    const validMoves=[
      draggedId-1,
      draggedId-width,
      draggedId+1,
      draggedId+width
    ];

    const validMove=validMoves.includes(replacedId);

    const isColumnofFour= checkForColumnOfFour()
   const isColumnofThree= checkForColumnOfThree()
    const isRowofFour= checkForRowOfFour()
    const isRowofThree=  checkForRowOfThree()

    if(replacedId && validMove && (isRowofFour || isRowofThree || isColumnofThree || isColumnofFour)){
      setSquareBeingDragged(null)
      setSquareBeingReplaced(null)
    }
    else{
      currentColorArrangement[replacedId]=squareBeingReplaced.getAttribute('src');
      currentColorArrangement[draggedId]=squareBeingDragged.getAttribute('src');
      setCurrentColorArrangement([...currentColorArrangement]);
    }





  };




  const createBoard = () => {
    const randomColourArrangement = [];

    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColours[Math.floor(Math.random() * candyColours.length)];
      randomColourArrangement.push(randomColor);
    }

    setCurrentColorArrangement(randomColourArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfThree();
      checkForColumnOfFour();
      checkForRowOfThree();
      checkForRowOfFour();
      moveIntoSquaresBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [moveIntoSquaresBelow,checkForRowOfThree,checkForColumnOfFour,checkForColumnOfThree,currentColorArrangement]);
  return (
    <div className="app" >
      
      <div className="game" >
       
        {currentColorArrangement.map((candycolor, i) => (
          <img
           src={candycolor}
            key={i}
           
            alt={candycolor}
            data-id={i}
            draggable={true}
            onDragStart={dragstart}
            onDragOver={(e)=> e.preventDefault()}
            onDragEnter={(e)=>e.preventDefault()}
            onDragLeave={(e)=>e.preventDefault()}
            onDrop={dragdrop}
            onDragEnd={dragend}

          />
        ))}
      </div>
      <ScoreBoard score={score}/>
    </div>
  );
};

export default App;
