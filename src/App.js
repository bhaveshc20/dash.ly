import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'standalone-react-css-transition-group';
import * as rapid from './RapidConnector';
import './App.css';
import Chart from 'chart.js';
import Form from "react-jsonschema-form";



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      gameId: 1,
      playerName: "John",
      sessionName: "Testing",
      gameStarted: false,
      gameCompleted: false,
      activeWord: [],
      activeLetters: [],
      wordsMastered: 0,
      timer: 0,
      wordList: [],
      font: 'sans',
      currentLevel: 1,
      points: 0,
      percentComplete: 0,
      maxPoints: 1000,
      playerObjs : [{"points": 0},{"points": 0},{"points": 0},{"points": 0}]
    }
    this.getWordList = this.getWordList.bind(this);
    this.getRandomInt = this.getRandomInt.bind(this);
    this.getWord = this.getWord.bind(this);
    this.checkEqual = this.checkEqual.bind(this);
    this.timer = this.timer.bind(this);
    this.startGame = this.startGame.bind(this);
    this.rating = this.rating.bind(this);
    this.switchFonts = this.switchFonts.bind(this);
    this.startGameAsHarjit = this.startGameAsHarjit.bind(this);
    this.startGameAsJoe = this.startGameAsJoe.bind(this);
    this.startGameAsAndrew = this.startGameAsAndrew.bind(this);
    this.startGameAsBhavesh = this.startGameAsBhavesh.bind(this);
    this.GetPointAward = this.GetPointAward.bind(this);
    this.AwardPoints = this.AwardPoints.bind(this);
    this.Update = this.Update.bind(this);
    //this.ClientNameInputHandler = this.ClientNameInputHandler.bind(this);
    //this.SessionNameInputHandler = this.SessionNameInputHandler.bind(this);
    this.interval;
  }
  static propTypes = {
    percentComplete: PropTypes.number
  }

  ClientNameInputHandler(e)
  {
    this.setState({
      playerName : e.target.value
    })
  }

  AwardPoints(playerName, points){
    rapid.AddPoints(this.state.sessionName, playerName, points);
    var value = this.state.points += points;
    this.setState({
      points: value
    })

    if(value > this.state.maxPoints)
    {
      rapid.SendWin(this.state.sessionName, playerName);
      this.setState({
        gameCompleted: true
      });
    }
  }

  componentWillMount(){
    var self = this;
    document.addEventListener('keydown', function(e) {
      e.preventDefault();

      // handle backspace and delete
      if(e.which == 46 || e.which == 8){
        this.setState({
          activeLetters: this.state.activeLetters.slice(0,-1)
        })
        return true;
      }

      // otherwise add character to array
      let char = String.fromCharCode(e.which);
      let newActiveLetters = this.state.activeLetters;
      newActiveLetters.push(char);
      if(this.checkEqual(newActiveLetters, this.state.activeWord) ){
        var points = this.state.activeWord.length * 10;;
        self.AwardPoints(this.state.playerName, points);
        this.setState({
          activeWord: this.getWord(),
          activeLetters: [],
          wordsMastered: this.state.wordsMastered + 1,
        });
          if(this.state.wordsMastered % 5 == 0 && this.state.wordsMastered !== 0){
            self.levelUp(this.state.playerName);
            console.log(this.state.playerName);
            this.setState({
              wordList: this.getWordList(),
              wordsMastered: 0
            });
        }
      }
      else{
        this.setState({
          activeLetters: newActiveLetters
        })
      }

    }.bind(this));
  }

  levelUp(player)
  {
    rapid.LevelUp(player);
  }

  checkEqual(arr1, arr2) {
      if(arr1.length !== arr2.length)
          return false;
      for(var i = arr1.length; i--;) {
          if(arr1[i] !== arr2[i])
              return false;
      }

      return true;
  }


  getRandomInt(min=0, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  GetPointAward(word)
  {
    var points = word.length * 10;
  }

  timer(){
    let newTime = this.state.timer - 1;
    this.setState({
      timer: newTime
    })
    if(newTime === 0){
      window.clearInterval(this.interval);
    }
  }

  rating(){
    if(this.state.wordsMastered < 15){
      return '😫'
    }
    else if(this.state.wordsMastered < 25){
      return '😐'
    }
    else if(this.state.wordsMastered < 35){
      return '😊'
    }
    else if(this.state.wordsMastered < 45){
      return '😃'
    }
    else{
      return '😎'
    }
  }

  startGame(player){
    //$('#GameId').val();
    //$('#')
    var self = this;
    if(player === null)
      {
        player = this.state.playerName;
      }

    rapid.init(
      player,
      this.state.sessionName,
      function(){
        console.log("Game ready");
        rapid.UpdateWordFilterSubscription(function(){
          var word = self.getWord();
          self.setState({
            activeWord: word,
            gameStarted: true,
            wordsMastered: 0,
            timer: 60
          });
        });
      },function(gameSession){
        self.Update(gameSession);

      }
  );

}

Update(gameSession)
{


  var playerArr = gameSession.players;
  this.setState({playerObjs: playerArr});
  debugger;
  //check win
  if(gameSession.completed)
  {
    this.setState({
      gameCompleted: true
    })
  }
}

  getWord(){

    /*
    let index = this.getRandomInt(0, this.state.wordList.length);
    let wordToUse = this.state.wordList[index];
    let newWordsList = this.state.wordList;
    */
    var newWordList = this.getWordList()
    var index = this.getRandomInt(0, newWordList.length)
    var wordToUse = newWordList[index]
    newWordList.splice(index, 1);

    this.setState({
      wordList: newWordList
    })

    return wordToUse.split("");
  }

  switchFonts(){
    if(this.state.font === 'sans'){
      document.getElementById('app').classList.add('serif');
      this.setState({
        font: 'serif'
      });
    }
    else{
      document.getElementById('app').classList.remove('serif');
      this.setState({
        font: 'sans'
      });
    }

  }
  getWordList(){

    var list = rapid.GetWords();
    var uppers = list.map(function(x) {return x.toUpperCase(); });
    console.log(uppers);
    return uppers;


  }

  updatePlayerName(e){

    this.setState({
      playerName: e.target.value
    });
  }

  updateSessionName(e){

    this.setState({
      sessionName: e.target.value
    });
  }

  startGameAsHarjit()
  {
    this.startGame("Harjit");
    this.setState({
      playerName: "Harjit"
    });
  }

  startGameAsBhavesh()
  {
    this.startGame("Bhavesh");
    this.setState({
      playerName: "Bhavesh"
    });
  }

  startGameAsJoe()
  {
    this.startGame("Joe");
    this.setState({
      playerName: "Joe"
    });
  }

  startGameAsAndrew()
  {
    this.startGame("Andrew");
    this.setState({
      playerName: "Andrew"
    });
  }

  render(){

    let letters = [];
    let board;
    this.state.activeWord.map((current, index) =>{
      let correct;
      if(this.state.activeLetters[index] === undefined){
        correct='undefined'
      }
      else if(this.state.activeLetters[index] === current){
        correct='true'
      }
      else{
        correct='false'
      }
      letters.push(<span className="game-letter" key={index} data-correct={correct}>{current}</span>)
    });
    if(!this.state.gameStarted){
      board=(
         <div className="game__board" key="start">
          <h1 className="main-header animated fadeInLeft" >{'DASH.LY'}</h1>
          <div className="all-buttons">
             <button className="button harjit" onClick={this.startGameAsHarjit}>Harjit</button>
            <button className="button joe" onClick={this.startGameAsJoe}>Joe</button>
            <button className="button bhavesh" onClick={this.startGameAsBhavesh}>Bhavesh</button>
            <button className="button andrew" onClick={this.startGameAsAndrew}>Andrew</button>
            </div>
         </div>);
    }
    else if(!this.state.gameCompleted && this.state.gameStarted){
       board=(
         <div className="row">
           <div className="col s4">
             <div className="game__board" key="inprogress">
               <div className="game__score"><h2>{'SCORE'}</h2><h1>{this.state.points}</h1></div>
               <ReactCSSTransitionGroup transitionName='fade' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
               <div className="game__words" key={this.state.activeWord}>{letters}</div>
               </ReactCSSTransitionGroup>
               {/* <div className="game__timer">{'TIME LEFT: ' + this.state.timer}</div> */}
             </div>
           </div>
           <div className="col s8">
             <div className="progress-bar1">
               <div className="progress-fill1" style={{width: (0 + this.state.playerObjs[0].points)/10 + '%', backgroundColor: '#35e5Fd', transition:'width 2s'}}>
               <h2 className="progress-bar-name">{this.state.playerObjs[0].points}</h2>
             <br/>
               <h2 className="progress-bar-name2">{this.state.playerObjs[0].name}</h2>
            </div>
           </div>
           <div className="progress-bar2">
               <div className="progress-fill2" style={{width: (0 + this.state.playerObjs[1].points)/10 + '%', backgroundColor: '#fd6fec', transition:'width 2s'}}>
               <h2 className="progress-bar-name">{this.state.playerObjs[1].points}</h2>
               <br/>
               <h2 className="progress-bar-name2">{this.state.playerObjs[1].name}</h2>
            </div>
           </div>
           <div className="progress-bar3">
               <div className="progress-fill3" style={{width: (0 + this.state.playerObjs[2].points)/10 + '%', backgroundColor: '#32fec0', transition:'width 2s'}}>
               <h2 className="progress-bar-name">{this.state.playerObjs[2].points}</h2>
               <br/>
               <h2 className="progress-bar-name2">{this.state.playerObjs[2].name}</h2>
            </div>
           </div>
           <div className="progress-bar4">
               <div className="progress-fill4" style={{width: (0 + this.state.playerObjs[3].points)/10 + '%', backgroundColor: '#fff83b', transition:'width 2s'}}>
               <h2 className="progress-bar-name">{this.state.playerObjs[3].points}</h2>
               <br/>
               <h2 className="progress-bar-name2">{this.state.playerObjs[3].name}</h2>
            </div>
           </div>
         </div>
       </div>
           );
    }
    else{
      board=(
        <div className="game__board" key="timesup">
          <div className="game__words">
            <p>{''}</p>
            <h1>{'FINAL SCORE: ' + this.state.points}</h1>
            <button className="button" onClick={window.location.refresh}>{'Play Again'}</button>
          </div>
        </div>
      )
    }

    return(
      <div className="game">
        <ReactCSSTransitionGroup transitionName='scale' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        {board}
        </ReactCSSTransitionGroup>
         <input className="secret-input" type="text"/>
      </div>
    );
  }
 }


export default App;
