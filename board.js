(function (root) {
  var MS = root.MS = (root.MS || {});

  var Board = MS.Board = function (size, numberOfMines) {
    this.dims = size;
    this.numberOfMines = numberOfMines;
    this.mines = [];
    this.numbers = [];
    this.mineCounts = {};
  };

  Board.prototype.randomPosition = function () {
    return [Math.floor(Math.random() * this.dims),
            Math.floor(Math.random() * this.dims)]
  };

  Board.prototype.isMine = function (newMine) {
    return _.some(this.mines, function (mine) {
      return _.isEqual(mine, newMine)
    });
  };

  Board.prototype.makeMine = function () {
    var newMine = this.randomPosition();
    var mineExists = this.isMine(newMine);

    if (mineExists) {
      return this.makeMine();
    }
    else {
      return newMine
    }
  };

  Board.prototype.placeMines = function () {
    for (var i = 0; i < this.numberOfMines; i++) {
      this.mines.push(this.makeMine());
    };
  };

  Board.prototype.onBoard = function (pos) {
    var self = this;
    return _(pos).every(function (coord) {
      return (coord >= 0 && coord < self.dims)
    });
  };

  Board.prototype.mineCount = function(pos) {
    count = 0

    for (var i = pos[0] - 1; i <= pos[0] + 1; i++) {
      for (var j = pos[1] - 1; j <= pos[1] + 1; j++) {
        if (this.onBoard([i, j]) && !_.isEqual([i, j], pos)) {
          var minePos = _(this.mines).find(function (mine) {
            return _.isEqual([i, j], mine)
          });

          if (typeof minePos !== "undefined") count++;
          };
      };
    };

    return count;
  };

  Board.prototype.findNumbers = function () {
    for (var i = 0; i < this.dims; i++) {
      for (var j = 0; j < this.dims; j++) {
        if (!this.isMine([i, j])) {
          this.numbers.push([i, j]);
          this.mineCounts[String([i, j])] = this.mineCount([i, j]);
        };
      };
    };
  };

  Board.prototype.numberOfNonMines = function () {
    return this.dims * this.dims - this.mines.length;
  };
})(this);