!function () {
    const Observable = function () {
        const _self = this;
        _self.data;
        _self.subs = [];
        _self.methods = {
            publish: function (newData) {
                if (typeof newData !== 'undefined') {
                    _self.data = newData;
                    for (let i = 0, ilen = _self.subs.length; i < ilen; ++i) {
                        _self.subs[i](_self.data);
                    }
                } else {
                    return _self.data;
                }
            },
            subscribe: function (callback) {
                if (_self.subs.indexOf(callback) === -1) {
                    _self.subs.push(callback);
                }
            },
            unsubscribe: function (callback) {
                if (_self.subs.indexOf(callback) !== -1) {
                    _self.subs.splice(_self.subs.indexOf(callback), 1);
                }
            }
        };
        return _self.methods;
    };

    /*

    easy - 8x8: 10 mines
    medium - 10x10: 20 mines
    expert - 16x16: 40 mines

    y = row
    x= column

     */

    const view = {
        playingField: document.getElementById('field'),
        fieldBaseImage: document.getElementsByClassName('diaper-base')[0],
        fieldCoverImage: document.getElementsByClassName('diaper-cover')[0],
        mineImage: document.getElementsByClassName('mine')[0],
        flagImage: document.getElementsByClassName('flag')[0],
        levelSelection: document.getElementById('level-selection'),
        levelSelectButtons: document.querySelectorAll('[data-level]'),
        wonDialog: document.getElementById('won'),
        lostDialog: document.getElementById('lost'),
    };
    const model = {
        selectedLevel: new Observable(),
        fieldSizeOptions: {easy: {x: 8, y: 8}, medium: {x: 10, y: 10}, expert: {x: 16, y: 16}},
        mineAmountOptions: {easy: 10, medium: 20, expert: 40},
        field: [],
        mines: [],
        mineLocationOptions: [],
    };

    const controller = {
        removeFlag: function (x, y) {
            document.querySelector('[data-x="' + x + '"][data-y="' + y + '"] .flag').remove();
        },
        addFlag: function (x, y) {
            const flagImage = view.flagImage.cloneNode();
            flagImage.addEventListener('click', function () {
                controller.removeFlag(x, y);
            });
            const selectedField = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
            selectedField.appendChild(flagImage);
        },
        openDiaper: function (x, y) {
            document.querySelector('[data-x="' + x + '"][data-y="' + y + '"] .diaper-cover').remove();
            controller.checkWin();
        },
        openDiaperChain: function (x, y) {
            let tilesToclearAround = [{x: x, y: y}]
            for (let i = 0; i < tilesToclearAround.length; i++) {
                let testY, testX, loopX = tilesToclearAround[i].x, loopY = tilesToclearAround[i].y;
                // center center
                if (document.querySelector('[data-x="' + loopX + '"][data-y="' + loopY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + loopX + '"][data-y="' + loopY + '"] .diaper-cover').remove();
                }
                // top left
                testY = loopY - 1;
                testX = loopX - 1;
                if (testY >= 0 && testX >= 0 && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
                // top center
                testY = loopY - 1;
                testX = loopX;
                if (testY >= 0 && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
                // top right
                testY = loopY - 1;
                testX = loopX + 1;
                if (testY >= 0 && testX < model.field[0].length && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
                // center left
                testY = loopY;
                testX = loopX - 1;
                if (testX >= 0 && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
                // center right
                testY = loopY;
                testX = loopX + 1;
                if (testX < model.field[0].length && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
                // bottom left
                testY = loopY + 1;
                testX = loopX - 1;
                if (testY < model.field.length && testX >= 0 && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
                // bottom center
                testY = loopY + 1;
                testX = loopX;
                if (testY < model.field.length && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
                // bottom right
                testY = loopY + 1;
                testX = loopX + 1;
                if (testY < model.field.length && testX < model.field[0].length && document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover')) {
                    document.querySelector('[data-x="' + testX + '"][data-y="' + testY + '"] .diaper-cover').remove();
                    if (model.field[testY][testX].publish() === 0) {
                        tilesToclearAround.push({x: testX, y: testY});
                    }
                }
            }
        },
        checkWin: function () {
            if (document.querySelectorAll('#field .diaper-cover').length === model.mines.length) {
                controller.gameWon();
            }
        },
        gameWon: function () {
            view.wonDialog.open = true;
        },
        gameLost: function (x, y) {
            document.querySelector('[data-x="' + x + '"][data-y="' + y + '"] .diaper-cover').remove();
            view.lostDialog.open = true;
        },
    };
    const setup = {
        modelField: function (selectedLevel) {
            const columnSize = model.fieldSizeOptions[selectedLevel].y;
            const rowSize = model.fieldSizeOptions[selectedLevel].x;

            model.field = new Array(columnSize);
            for (let y = 0; y < columnSize; y++) {
                model.field[y] = new Array(rowSize);
                for (let x = 0; x < rowSize; x++) {
                    model.field[y][x] = new Observable();
                    model.field[y][x].publish(0);
                    model.mineLocationOptions.push({y: y, x: x});
                }
            }
        },
        viewField: function () {
            const columnSize = model.field.length;
            const rowSize = model.field[0].length;

            view.playingField.style.gridTemplateColumns = "repeat(" + columnSize + ", minmax(0, 1fr))";
            view.playingField.style.gridTemplateRows = "repeat(" + rowSize + ", minmax(0, 1fr))";

            for (let y = 0; y < columnSize; y++) {
                for (let x = 0; x < rowSize; x++) {
                    const field = document.createElement('div');
                    const baseImage = view.fieldBaseImage.cloneNode();
                    const numberValue = document.createElement('p');
                    const mine = view.mineImage.cloneNode();
                    const coverImage = view.fieldCoverImage.cloneNode();

                    field.className = "relative w-full h-full";
                    field.dataset.x = "" + x;
                    field.dataset.y = "" + y;
                    numberValue.className = "absolute inset-0 pointer-events-none flex justify-center items-center text-[min(3.5vw,_37px)]";

                    field.appendChild(baseImage);
                    field.appendChild(numberValue);
                    field.appendChild(mine);
                    field.appendChild(coverImage);
                    view.playingField.appendChild(field);
                }
            }
        },
        modelMines: function (selectedLevel) {
            const mineAmount = model.mineAmountOptions[selectedLevel];
            const arraySize = model.fieldSizeOptions[selectedLevel].y * model.fieldSizeOptions[selectedLevel].x;

            for (let i = 0; i < mineAmount; i++) {
                const randomLocation = Math.floor(Math.random() * arraySize);
                const mineLocation = model.mineLocationOptions.splice(randomLocation, 1);
                model.mines.push(...mineLocation);
            }

            for (let j = 0, jlen = model.mines.length; j < jlen; j++) {
                const mine = model.mines[j];
                model.field[mine.y][mine.x].publish('mine');
            }
        },
        modelFieldValues: function (mines) {
            for (let j = 0, jlen = mines.length; j < jlen; j++) {
                let x = mines[j].x, y = mines[j].y, testX, testY;
                // top left field
                testY = y - 1;
                testX = x - 1;
                if (testY >= 0 && testX >= 0 &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
                // top center field
                testY = y - 1;
                testX = x;
                if (testY >= 0 &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
                // top right field
                testY = y - 1;
                testX = x + 1;
                if (testY >= 0 && testX < model.field[0].length &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
                // center left field
                testY = y;
                testX = x - 1;
                if (testX >= 0 &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
                // center right field
                testY = y;
                testX = x + 1;
                if (testX < model.field[0].length &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
                // bottom left field
                testY = y + 1;
                testX = x - 1;
                if (testY < model.field.length && testX >= 0 &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
                // bottom center field
                testY = y + 1;
                testX = x;
                if (testY < model.field.length &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
                // bottom right field
                testY = y + 1;
                testX = x + 1;
                if (testY < model.field.length && testX < model.field[0].length &&
                    model.field[testY][testX].publish() !== "mine") {
                    model.field[testY][testX].publish(model.field[testY][testX].publish() + 1);
                }
            }
        },
        viewFields: function (fields) {
            const columnSize = fields.length;
            const rowSize = fields[0].length;

            for (let y = 0; y < columnSize; y++) {
                for (let x = 0; x < rowSize; x++) {
                    if (fields[y][x].publish() === 'mine') {
                        document.querySelector('[data-x="' + x + '"][data-y="' + y + '"] .mine').classList.remove("hidden");
                    }
                    if (fields[y][x].publish() > 0) {
                        document.querySelector('[data-x="' + x + '"][data-y="' + y + '"] p').innerHTML = fields[y][x].publish();
                    }
                }
            }
        },
        listeners: function () {
            [...document.querySelectorAll('#field .diaper-cover')].forEach(diaperCover => {
                let longTouch;
                diaperCover.addEventListener('click', function () {
                    const x = parseInt(diaperCover.parentElement.dataset.x);
                    const y = parseInt(diaperCover.parentElement.dataset.y);
                    switch (model.field[y][x].publish()) {
                        case 'mine':
                            controller.gameLost(x, y);
                            break;
                        case 0:
                            controller.openDiaperChain(x, y);
                            break;
                        default:
                            controller.openDiaper(x, y);
                            break;
                    }
                });
                diaperCover.addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                    const x = parseInt(diaperCover.parentElement.dataset.x);
                    const y = parseInt(diaperCover.parentElement.dataset.y);
                    controller.addFlag(x, y);
                });
                diaperCover.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    longTouch = setTimeout(function (){
                        const x = parseInt(diaperCover.parentElement.dataset.x);
                        const y = parseInt(diaperCover.parentElement.dataset.y);
                        controller.addFlag(x, y);
                    }, 500);
                });
                diaperCover.addEventListener('touchend', function (e) {
                    e.preventDefault();
                    if (longTouch) {
                        clearTimeout(longTouch);
                    }else {
                        const x = parseInt(diaperCover.parentElement.dataset.x);
                        const y = parseInt(diaperCover.parentElement.dataset.y);
                        controller.openDiaper(x, y);
                    }
                });
            });
        },
        init: function () {
            // field setup
            model.selectedLevel.subscribe(function (selectedLevel) {
                view.levelSelection.classList.add('hidden', 'sm:hidden');
                view.playingField.classList.remove('hidden');
                view.playingField.classList.add('grid');
                setup.modelField(selectedLevel);
                setup.viewField();
                setup.modelMines(selectedLevel);
                setup.modelFieldValues(model.mines);
                setup.viewFields(model.field);
                setup.listeners();
            });

            // level selection
            [...view.levelSelectButtons].forEach(button => {
                button.addEventListener('click', function () {
                    model.selectedLevel.publish(button.dataset.level);
                });
            })
        }
    }

    setup.init();
}()
