import './App.css';
import StartScreen from './Components/StartScreen';
import { useCallback, useEffect, useState } from 'react';
import { wordsList } from './data/words';
import Game from './Components/Game';
import GameOver from './Components/GameOver';


const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},      /*Array com cada estágio declarado. Responsável para mandar cada estágio para o return*/
  {id: 3, name: "end"},
];

function App() {
  //Atributos utilizados na lógica do sistema:
  const [gameStage, setGameStage] = useState(stages[0].name) /*Ele começa no estágio 0. Crio duas variáveis para fazer o código e a lógica.*/
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const[guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(5);
  const [score, setScore] = useState(0)

  //Funçôes Utilizadas na lógica do sistema:

      //Função para fazer o sorteio do programa
  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);

    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)] // Fazer o sorteio da categoria 
    console.log(category)

    const word = words[category][Math.floor(Math.random() * words[category].length)]; // Fazer o sorteio das palavras de acordo com sua categoria

    return{category,word}
  }, [words]);

      //Função que vai criar variáveis, separar a palavra, deixar todas as letras minúsculas 
  const startGame = useCallback(() => {
    clearLettersStates();

    const {category, word} = pickWordAndCategory(); //Criando as variáveis/atributos palavra e categoria

    let wordLetters = word.split(""); // Separar as palavras letra por letra

    wordLetters = wordLetters.map((l) => l.toLowerCase()); // Deixar as letras todas minúsculas

    setPickedCategory(category)
    setPickedWord(word)
    setLetters(wordLetters)

    setGameStage(stages[1].name)  /*Quando a pessoa aperta no botão ele passa para o estágio 1.*/
  }, [pickWordAndCategory]);

  /*Verificando as letras do input*/
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();   //Colocando todas as letras minúsculas

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;                                                            //Conferir se a letra está inclusa ou não no array
    } 

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, 
        letter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [    //condicional para ver se a letra tem na palavra ou não
        ...actualWrongLetters, 
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
     }
  }

  const retry = () => {
    setScore(0);
    setGuesses(5);   //As chances começarem 5, acabar em 0 e começar novamente em 5. 
    setGameStage(stages[0].name) /*Função para resetar o jogo*/
  }

  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

    //Checar se o usuário perdeu o jogo
  useEffect(() => {
    if (guesses === 0) {
      clearLettersStates();     //Iniciar o jogo zerado
      setGameStage(stages[2].name);
    }
    }, [guesses]);  

    //Checar se o usuário ganhou o jogo


    useEffect(() => {
      const uniqueLetters = [...new Set(letters)];
  
      console.log(uniqueLetters);
      console.log(guessedLetters);
  
      // win condition
      if (guessedLetters.length ===
        uniqueLetters.length && gameStage === stages[1].name) {
        // add score
        setScore((actualScore) => (actualScore + 100));
  
        // restart game with new word
        startGame();
      }
    }, [guessedLetters, letters, startGame, gameStage]);

  //Parte que vai receber os atributos para mandar para cada componente específico 
  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />} {/* Parte antes de iniciar o jogo(pagina inicial) */}


    {/*Recebendo os atributos de game*/}
      {gameStage === "game" && <Game verifyLetter={verifyLetter} 
      pickedWord = {pickedWord} 
      pickedCategory = {pickedCategory} 
      letters = {letters}                    
      guessedLetters = {guessedLetters} 
      wrongLetters = {wrongLetters} 
      guesses = {guesses} 
      score = {score} />} {/*Parte do jogo em si */}

      {gameStage === "end" && <GameOver retry={retry} score={score}/>}  {/* Parte de quando o usuário perde */}
    </div>
  );
}

export default App;
