(function (root) {
  var MS = root.MS = (root.MS || {});

  var Game = MS.Game = function ($el, board) {
    this.$el = $el;
    this.board = board;
    this.revealed = [];
    this.board.placeMines();
    this.board.findNumbers();
  };

  Game.prototype.render = function () {
    var self = this;
    var board = this.board;

    self.$el.empty();

    cellMatrix = (function () {
      return _.times(board.dims, function (i) {
        return _.times(board.dims, function (j) {
          return $("<div class='cell' data-id='" + i + "," + j + "'></div>");
        });
      });
    })();

    _(board.mines).each(function (mine) {
      cellMatrix[mine[0]][mine[1]]
      .addClass("mine")
      .append("<img src='sea_mine.png' class='mine-img'>");
    });

    _(board.numbers).each(function (numberPos) {
      var cssClass = "mines-amt-" + board.mineCounts[String(numberPos)]
      var mineCount = board.mineCounts[String(numberPos)];

      cellMatrix[numberPos[0]][numberPos[1]]
        .addClass(cssClass)
        .text(mineCount == 0 ? "" : mineCount);
    });

    for (var i = 0; i < board.dims; i++) {
      for (var j = 0; j < board.dims; j++) {
        cellMatrix[i][j].addClass("hidden")
      };
    };

    _(cellMatrix).each(function ($cell) {
      self.$el.append($cell);
    });
  };

  Game.prototype.reveal = function (pos) {

    var notRevealed = _(this.revealed).every(function (revealPos) {
      return !_.isEqual(pos, revealPos);
    });

    if (this.board.onBoard(pos) && notRevealed) {
      this.revealed.push(pos);
      $("div[data-id='" + String(pos) + "']").removeClass("hidden")

      if (this.board.mineCounts[String(pos)] == 0) {
        for (var i = pos[0] - 1; i <= pos[0] + 1; i++) {
          for (var j = pos[1] - 1; j <= pos[1] + 1; j++) {
            if (!_.isEqual([i, j], pos)) this.reveal([i, j]);
          };
        };
      };
    };
  };

  Game.prototype.validate = function () {
    $("#validate").unbind();

    if (this.revealed.length == this.board.numberOfNonMines()) {
      $(".mine-img").css({opacity: 1})
      $("div").removeClass("hidden");
      $("#validate").empty().append("<img src='smiley_won.png'>")
      $(".won").toggle();
      $(".play-again").toggle();
    }
    else {
      this.over();
    };
  };

  Game.prototype.over = function () {
    $(".mine-img").css({opacity: 1})
    $("div").removeClass("hidden");
    $("#validate").empty().append("<img src='smiley_dead.png'>")
    $(".lost").toggle();
    $(".play-again").toggle();
  };

})(this);

$(document).ready(function () {
  var newGame = function () {
    var game = new MS.Game($("#grid"), new MS.Board(8, 10));
    game.render();

    var convertToArray = function (string) {
      return _(string.split(",")).map(function (numString) {
        return parseInt(numString);
      });
    };

    $(".hidden").on("click", function () {
      if ($(event.target).hasClass("mine-img")) {
        game.over();
      }
      else {
        var pos = convertToArray($(event.target).data("id"));
        game.reveal(pos);
      }
    });

    $("#validate").on("click", function () {
      game.validate();
    });
  };

  newGame();

  $(".yes").on("click", function () {
    $(".play-again").toggle();
    $("#validate").empty().append("<img src='smiley_alive.png'>")

    if ($(".lost").css("display") !== "none") {
      $(".lost").toggle();
    }
    else if ($(".won").css("display") !== "none") {
      $(".won").toggle();
    }

    newGame();
  });

  $(".no").on("click", function () {
    $(".play-again").toggle();
    $(".thanks").toggle();
  });
});