(function() {
  var RsenseProvider;

  RsenseProvider = require('./autocomplete-ruby-provider.coffee');

  module.exports = {
    config: {
      port: {
        description: 'The port the rsense server is running on',
        type: 'integer',
        "default": 47367,
        minimum: 1024,
        maximum: 65535
      }
    },
    rsenseProvider: null,
    activate: function(state) {
      return this.rsenseProvider = new RsenseProvider();
    },
    provideAutocompletion: function() {
      return {
        providers: [this.rsenseProvider]
      };
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.rsenseProvider) != null) {
        _ref.dispose();
      }
      return this.rsenseProvider = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1ydWJ5L2xpYi9hdXRvY29tcGxldGUtcnVieS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsY0FBQTs7QUFBQSxFQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHFDQUFSLENBQWpCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFDRTtBQUFBLFFBQUEsV0FBQSxFQUFhLDBDQUFiO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxRQUdBLE9BQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxPQUFBLEVBQVMsS0FKVDtPQURGO0tBREY7QUFBQSxJQVFBLGNBQUEsRUFBZ0IsSUFSaEI7QUFBQSxJQVVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxjQUFELEdBQXNCLElBQUEsY0FBQSxDQUFBLEVBRGQ7SUFBQSxDQVZWO0FBQUEsSUFhQSxxQkFBQSxFQUF1QixTQUFBLEdBQUE7YUFDckI7QUFBQSxRQUFDLFNBQUEsRUFBVyxDQUFDLElBQUMsQ0FBQSxjQUFGLENBQVo7UUFEcUI7SUFBQSxDQWJ2QjtBQUFBLElBZ0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQWUsQ0FBRSxPQUFqQixDQUFBO09BQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUZSO0lBQUEsQ0FoQlo7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/yggdrasil/.atom/packages/autocomplete-ruby/lib/autocomplete-ruby.coffee
