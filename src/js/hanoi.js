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
            alert('invalid move');
            this.pickedTower = null;
            return false;
        }

        this.executeFloorMove(this.pickedTower, targetTowerIndex);

        if (this.isSolved()) {
            alert(`YOU MANAGE TO COMPLETE ${this.floorCount} floors of tower of hanoi in just ${this.moves} moves`);
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
    }

    floorSettingsHandler(event) {
        if (event.target.id == 'btn_floorIncrement') {
            this.floorInput.stepUp();
        } else if (event.target.id == 'btn_floorDecrement') {
            this.floorInput.stepDown();            
        } else return;

        this.initGameFunction();
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
        
    }
}