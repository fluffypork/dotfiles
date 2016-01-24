(function() {
  module.exports = function(splitDirection, oldEditor) {
    var directions, options, pane;
    pane = atom.workspace.paneForURI(oldEditor.getURI());
    options = {
      copyActiveItem: true
    };
    directions = {
      left: function() {
        return pane.splitLeft(options);
      },
      right: function() {
        return pane.splitRight(options);
      },
      up: function() {
        return pane.splitUp(options);
      },
      down: function() {
        return pane.splitDown(options);
      }
    };
    pane = directions[splitDirection]().getActiveEditor();
    oldEditor.destroy();
    return pane;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9zcGxpdFBhbmUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsY0FBRCxFQUFpQixTQUFqQixHQUFBO0FBQ2YsUUFBQSx5QkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBZixDQUEwQixTQUFTLENBQUMsTUFBVixDQUFBLENBQTFCLENBQVAsQ0FBQTtBQUFBLElBQ0EsT0FBQSxHQUFVO0FBQUEsTUFBRSxjQUFBLEVBQWdCLElBQWxCO0tBRFYsQ0FBQTtBQUFBLElBRUEsVUFBQSxHQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBQSxHQUFBO2VBQ0osSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLEVBREk7TUFBQSxDQUFOO0FBQUEsTUFFQSxLQUFBLEVBQU8sU0FBQSxHQUFBO2VBQ0wsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsT0FBaEIsRUFESztNQUFBLENBRlA7QUFBQSxNQUlBLEVBQUEsRUFBSSxTQUFBLEdBQUE7ZUFDRixJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsRUFERTtNQUFBLENBSko7QUFBQSxNQU1BLElBQUEsRUFBTSxTQUFBLEdBQUE7ZUFDSixJQUFJLENBQUMsU0FBTCxDQUFlLE9BQWYsRUFESTtNQUFBLENBTk47S0FIRixDQUFBO0FBQUEsSUFXQSxJQUFBLEdBQU8sVUFBVyxDQUFBLGNBQUEsQ0FBWCxDQUFBLENBQTRCLENBQUMsZUFBN0IsQ0FBQSxDQVhQLENBQUE7QUFBQSxJQVlBLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FaQSxDQUFBO1dBYUEsS0FkZTtFQUFBLENBQWpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/yggdrasil/.atom/packages/git-plus/lib/splitPane.coffee
