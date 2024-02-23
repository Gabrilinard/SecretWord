import React from 'react';
import './StartScreen.css';

const StartScreen = ({startGame}) => {  /* lembrar sempre de chamar a função que fiz no app.js*/
  return (
    <div className='start'>
        <h1>Secret Word</h1>
        <p>Clique no botão abaixo para começar a jogar</p>
        <button onClick={startGame}>Começar o jogo</button>  {/*colocando a função em prática, quando o usuário clicar no botão*/}
    </div>
  )
}

export default StartScreen