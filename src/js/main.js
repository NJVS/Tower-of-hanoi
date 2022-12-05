import Hanoi from './hanoi.js';

document.addEventListener('DOMContentLoaded', () => {
    // settings
    document.querySelector('#btn_settings').addEventListener('click', event => {
        event.currentTarget.classList.toggle('active');
    });

    // input quantity (increment/decrement tower floors)
    // document.querySelector('#inp_quantity').addEventListener('click', event => {
    //     if (event.target.tagName === "INPUT") return;

    //     const input = event.currentTarget.querySelector('input[type=number]');
    //     const val = parseInt(input.value);
    //     const min = parseInt(input.getAttribute('min'));
    //     const max = parseInt(input.getAttribute('max'));
        
    //     if (event.target.dataset.quantity == 'increment') {
    //         // input.setAttribute('value', (val == max) ? max : val + 1);
    //         // input.value = (val == max) ? max : val + 1;
    //         input.stepUp();
    //     } else {
    //         // input.setAttribute('value', (val == min) ? min : val - 1);
    //         // input.value = (val == min) ? min : val - 1;
    //         input.stepDown();
    //     }


    //     input.dispatchEvent(new Event('change'));
    // });


    // game
    const towers = document.querySelectorAll('#gameBoard .tower-inner');
    const floors = document.querySelector('#inp_floorcount');
    const reset = document.querySelector('#btnReset');
    const solve = document.querySelector('#btnSolve');

    // new Hanoi(floors, towers, reset, solve);

    const gameBoard = document.querySelector('#gameBoard');
    const settings = document.querySelector('#settings');
    new Hanoi(gameBoard, settings);
});
