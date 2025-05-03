!function() {
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
        fieldBaseImage: document.getElementById('diaper-base'),
        fieldCoverImage: document.getElementById('diaper-cover'),
        mineImage: document.getElementById('mine'),
        flagImage: document.getElementById('flag'),
        levelSelectButtons: document.querySelectorAll('[data-level]'),
    };
    const model = {
        selectedLevel: new Observable(),
        fieldSizeOptions: {easy: {x: 8, y: 8}, medium: {x: 10, y: 10}, expert: {x: 16, y: 16}},
        mineAmountOptions: {easy: 10, medium: 20, expert: 40},
        field: [],
    };

    const controller = {
        fieldSetup: function (selectedLevel) {
            model.field = new Array(model.fieldSizeOptions[selectedLevel].y);
            // y
            for (let y = 0; y < model.fieldSizeOptions[selectedLevel].y; y++) {
                model.field[y] = new Array(model.fieldSizeOptions[selectedLevel].x);
                // x
                for (let x = 0; x < model.fieldSizeOptions[selectedLevel].x; x++) {
                    model.field[y][x] = new Observable();
                }
            }
        },
        init: function () {
            // field setup
            model.selectedLevel.subscribe(function (selectedLevel) {model.field = [];controller.fieldSetup(selectedLevel)});

            // level selection
            [...view.levelSelectButtons].forEach(button => {
                button.addEventListener('click',function () {
                    model.selectedLevel.publish(button.dataset.level);
                });
            })
        }
    }

    controller.init();
}()
