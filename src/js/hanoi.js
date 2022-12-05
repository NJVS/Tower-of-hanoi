export default class TowersOfHanoi {
    constructor(gameBoard, settings) {
        this.towerElements = gameBoard.querySelectorAll('.tower-inner');
        this.floorSettings = settings.querySelector('#inp_floorcount'); 
        this.floorInput = settings.querySelector('#inp_floorcount > input[type=number]');
        this.resetGame = settings.querySelector('#btn_reset');
        this.solveGame = settings.querySelector('#btn_solve');

        // bind
        this.bindFunctions();

        // game start
        this.initGame();

    }

    bindFunctions() {
        this.initGameFunction = this.initGame.bind(this);
        this.towerClickHandlerFunction = this.towerClickHandler.bind(this);
        this.floorSettingsHandlerFunction = this.floorSettingsHandler.bind(this);
        this.solveGameHandlerFunction = this.solveGameHandler.bind(this);
    }

    initGame() {
        this.floorCount = this.floorInput.value;
        this.pickedTower = null;
        this.moves = 0;
        this.moveHistory = []; 

        this.initTowers();
        this.initSettings();
        this.drawFloors();
        this.showMoveCount();
    }

    initTowers() {
        this.towers = [[], [], []];
        
        // add floors
        for (let i = 1; i <= this.floorCount; i++) {
            this.towers[0].push(i);
        }

        // click event on towers
        this.towerElements.forEach(towerElement => {
            towerElement.addEventListener('click', this.towerClickHandlerFunction);
        });
    }

    

    towerClickHandler(event) {
        const targetTowerIndex = event.currentTarget.dataset.tower; // make sure to remove pointerevents on li/floor elements
        
        if (!this.pickedTower) {
            // check if the picked tower doesnt have any floors
            if (this.isTowerEmpty(this.towers[targetTowerIndex])) return false;
            
            this.pickedTower = targetTowerIndex; 
            this.showPickedFloor(true);
            return true;
        } else {
            this.showPickedFloor(false);
        }

        // validate move
        const validMove = this.validateMove(this.pickedTower, targetTowerIndex);
        // console.log('picked: ' + this.pickedTower);
        // console.log(targetTowerIndex);

        if (!validMove) {
            if (validMove !== undefined) this.displayAlert('Invalid move');
            
            this.pickedTower = null;
            return false;
        }

        this.executeFloorMove(this.pickedTower, targetTowerIndex);

        if (this.isSolved()) {
            this.displayAlert(`YOU MANAGE TO COMPLETE ${this.floorCount} floors of tower of hanoi in just ${this.moves} moves`);
        }
    }

    executeFloorMove(from, to) {
        // parse
        from = parseInt(from);
        to = parseInt(to);
        
        // move floor
        this.towers[to].push(this.towers[from].pop());

        this.moves += 1;
        this.moveHistory.push([from, to]);

        // dom update
        this.drawFloors();
        this.showMoveCount();

        // reset picked
        this.pickedTower = null;
    }

    
    



    ///////////////////
    /// VALIDATIONS ///
    ///////////////////
    validateMove(from, to) {
        if (from === to) {
            return undefined;
        }

        const fromFloorValue = this.getTopFloorValue(this.towers[from]);
        const toFloorValue = this.getTopFloorValue(this.towers[to]);

        // console.log(this.towers);
        return ( this.isTowerEmpty(this.towers[from]) || fromFloorValue < toFloorValue )
                ? false : true;
    }

    isSolved() {
        return (this.isTowerEmpty(this.towers[0]) &&
                this.isTowerEmpty(this.towers[1]) &&
                this.towers[2].length == this.floorCount);
    }

    isTowerEmpty(tower) {
        return !tower.length;
    }

    getTopFloorValue(tower) {
        return (this.isTowerEmpty(tower)) ? undefined : tower[tower.length - 1];
    }




    ////////////////
    /// SETTINGS ///
    ////////////////
    initSettings() {
        this.floorSettings.addEventListener('click', this.floorSettingsHandlerFunction);
        this.resetGame.addEventListener('click', this.initGameFunction);
        this.solveGame.addEventListener('click', this.solveGameHandlerFunction);
    }

    floorSettingsHandler(event) {
        if (event.target.id == 'btn_floorIncrement') {
            this.floorInput.stepUp();
        } else if (event.target.id == 'btn_floorDecrement') {
            this.floorInput.stepDown();            
        } else return;

        this.initGameFunction();
    }

    disableGame() {
        this.towerElements.forEach(towerElement => {
            towerElement.removeEventListener('click', this.towerClickHandlerFunction);
        });
        this.floorSettings.removeEventListener('click', this.floorSettingsHandlerFunction);
        this.resetGame.removeEventListener('click', this.initGameFunction);
        this.solveGame.removeEventListener('click', this.solveGameHandlerFunction);
    }



    
    ///////////////////
    /// DOM RELATED ///
    ///////////////////
    drawFloors() {
        this.towerElements.forEach((towerElement, index) => {
            while(towerElement.lastChild) {
                towerElement.removeChild(towerElement.lastChild);
            }

            // create floors
            this.towers[index].map(floor => {
                let li = document.createElement('li');
                li.setAttribute('data-floor', floor);
                towerElement.append(li);
            });
        });
    }

    showPickedFloor(toggle) {
        // target floor will always be the last child, in this case the last child is on the top
        const targetFloor = this.towerElements[this.pickedTower].lastChild;
        (toggle) ? targetFloor.classList.add('picked') : targetFloor.classList.remove('picked');
    }

    showMoveCount() {
        document.querySelector('#moveCount').innerHTML = this.moves;
    }

    displayAlert(msg) {
        this.disableGame();

        const container = document.createElement('div');
        container.className = 'alert';
        container.innerHTML = `
            <h3 class="alert_body">${msg}</h3>
            <button class="alert_close">close</button>
        `;

        container.querySelector('.alert_close').addEventListener('click', e => {
            container.remove()
            this.initSettings();
        });
        document.querySelector('main').append(container);
    }



    ////////////////////////
    /// HELL STARTS HERE ///
    ////////////////////////

    solveGameHandler() {
        this.disableGame();

        const solved = this.solve(this.floorCount, 0, 1, 2);

        solved.then(() => this.displayAlert('Auto solve complete!'));
    }

    async solve(N, t_from, t_aux, t_to) {
        if (N === 1) {
            await this.executeFloorMoveByAI(t_from, t_to, 500);
        } else {
            await this.solve(N - 1, t_from, t_to, t_aux);
            await this.solve(1, t_from, t_aux, t_to);
            await this.solve(N - 1, t_aux, t_from, t_to)
        }
        return this.isSolved();
    }

    async executeFloorMoveByAI(from, to, delay) {
        // wait for delay
        const _delay = new Promise(resolve => setTimeout(resolve, delay));
        await _delay;

        // if valid execute
        if (this.validateMove(from, to)) {
            const floorToMove = this.towers[from].pop();     
            this.towers[to].push(floorToMove);
            console.log(`Move Floor ${floorToMove} from Tower[${this.getTowerName(from)}] to Tower[${this.getTowerName(to)}]`);
        }

        this.drawFloors();
    }

    getTowerName(index) {
        return (index == 0) ? 'A' : (index == 1) ? 'B' : 'C';
    }
}