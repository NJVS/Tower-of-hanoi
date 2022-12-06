import "../styles/main.css";
import Hanoi from './hanoi.js';

document.addEventListener('DOMContentLoaded', () => {
    // toggle settings
    document.querySelector('#btn_settings').addEventListener('click', event => {
        event.currentTarget.classList.toggle('active');
    });
    // show rules
    document.querySelector('#btn_showRules').addEventListener('click', () => {
        document.querySelector('.rules-overlay').classList.add('show');
    });
    // close rules
    document.querySelector('#btn_closeRules').addEventListener('click', () => {
        document.querySelector('.rules-overlay').classList.remove('show');
    });

    // game
    const gameBoard = document.querySelector('#gameBoard');
    const settings = document.querySelector('#settings');
    new Hanoi(gameBoard, settings);
});
