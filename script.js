

// Main object
var practice = (function() {
  // Private members
  var startButton, theBox, that;
  var minShuffleSpeed = 220, maxShuffleSpeed = 1500, shuffleCount = 5, shuffleSpeed = 500;

  return {
    init: function() {
      startButton = $('#start-button');
      that = this;
      shuffleCount = $('#shuffle-count-input').val();

      $('#shuffle-speed-input').slider();

      // Select a box
      theBox = $('#box' + Math.floor(Math.random()*3+1).toString());
      theBox.css('background-color', 'green');

      // Bind dom actions
      startButton.on('click', function() {
        that.startGame();
      });
    },

    startGame: function() {
      // Make the box black
      $('#box-area').find('.box').each(function(i) {
        $(this).text('');
        $(this).css('background-color', 'black');
      });

      // Update variables
      shuffleCount = $('#shuffle-count-input').val();
      shuffleSpeed = maxShuffleSpeed -
        Math.floor($('#shuffle-speed-input').slider('value')*maxShuffleSpeed/100) +
        minShuffleSpeed;

      // Before shuffling, define what to do in the end
      var shuffleCallback = function() {
        var onBoxClick = function() {
          var clickedBox = $(this);
          // Define actions when the user clicks a box
          theBox.css('background-color', 'green');
          if (clickedBox.attr('id') === theBox.attr('id')) {
            // The user clicked the right one
            theBox.text('Correct!');
          } else {
            // The user clicked the wrong one
            clickedBox.css('background-color', 'red');
            clickedBox.text('Wrong!');
          }

          $('#box-area').find('.box').each(function(i) {
            if ($(this).attr('id') !== clickedBox.attr('id')) {
              $(this).text('');
            }
            $(this).css('cursor', 'default');
            $(this).off('click');
          });
        };

        $('#box-area').find('.box').each(function(i) {
          $(this).text('Select');
          $(this).css('cursor', 'pointer');
          $(this).on('click', onBoxClick);
        });
      };

      setTimeout(function() {
        // Shuffle
        that.shuffleBoxes(shuffleCallback);
      }, 1000);
    },

    shuffleBoxes: function(callback) {
      var i = 1;
      this.randomlySwapBox();
      var helper = function() {
        setTimeout(function() {
          if (i < shuffleCount) {
            that.randomlySwapBox();
            i = i + 1;
            helper();
          } else {
            // Done shuffling.
            callback();
          }
        }, shuffleSpeed);
      };
      helper();
    },

    randomlySwapBox: function() {
      var num1, num2, box1, box2;

      // Randomly select 2 boxes to swap
      num1 = Math.floor(Math.random()*3+1);
      do {
        num2 = Math.floor(Math.random()*3+1);
      } while (num2 === num1)

      box1 = $('#box' + num1.toString());
      box2 = $('#box' + num2.toString());

      this.swapBox(box1, box2);
    },

    swapBox: function(box1, box2) {
      var box1Pos = box1.position().left;
      var box2Pos = box2.position().left;

      // In case the 'left' css is not defined:
      box1.css('left', box1Pos);
      box2.css('left', box2Pos);

      box1.animate({left: box2Pos.toString()+'px'}, shuffleSpeed-20);
      box2.animate({left: box1Pos.toString()+'px'}, shuffleSpeed-20);
    }
  };
}());

$(document).ready(function() {
  practice.init();
});
