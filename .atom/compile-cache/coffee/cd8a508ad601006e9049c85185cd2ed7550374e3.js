(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-ruby-client.coffee');

  String.prototype.regExpEscape = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-ruby-rubyprovider';

    RsenseProvider.prototype.selector = '.source.ruby';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
      this.lastSuggestions = [];
    }

    RsenseProvider.prototype.requestHandler = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, row;
          row = options.cursor.getBufferRow() + 1;
          col = options.cursor.getBufferColumn() + 1;
          return completions = _this.rsenseClient.checkCompletion(options.editor, options.buffer, row, col, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(options.prefix, completions);
            if ((suggestions != null ? suggestions.length : void 0)) {
              _this.lastSuggestions = suggestions;
            }
            if (options.prefix === '.' || options.prefix === '::') {
              return resolve(_this.lastSuggestions);
            }
            return resolve(_this.filterSuggestions(options.prefix, _this.lastSuggestions));
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, completions) {
      var completion, kind, suggestion, suggestions, _i, _len;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          kind = completion.kind.toLowerCase();
          suggestion = {
            word: completion.name,
            prefix: prefix,
            label: "" + kind + " (" + completion.qualified_name + ")"
          };
          suggestions.push(suggestion);
        }
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.filterSuggestions = function(prefix, suggestions) {
      var expression, suggestion, suggestionBuffer, _i, _len;
      suggestionBuffer = [];
      if (!(prefix != null ? prefix.length : void 0) || !(suggestions != null ? suggestions.length : void 0)) {
        return [];
      }
      expression = new RegExp("^" + prefix.regExpEscape(), "i");
      for (_i = 0, _len = suggestions.length; _i < _len; _i++) {
        suggestion = suggestions[_i];
        if (expression.test(suggestion.word)) {
          suggestion.prefix = prefix;
          suggestionBuffer.push(suggestion);
        }
      }
      return suggestionBuffer;
    };

    RsenseProvider.prototype.dispose = function() {};

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1ydWJ5L2xpYi9hdXRvY29tcGxldGUtcnVieS1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLG1DQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxTQUFTLENBQUMsWUFBakIsR0FBZ0MsU0FBQSxHQUFBO0FBQzlCLFdBQU8sSUFBQyxDQUFBLE9BQUQsQ0FBUyxxQ0FBVCxFQUFnRCxNQUFoRCxDQUFQLENBRDhCO0VBQUEsQ0FGaEMsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw2QkFBQSxFQUFBLEdBQUksZ0NBQUosQ0FBQTs7QUFBQSw2QkFDQSxRQUFBLEdBQVUsY0FEVixDQUFBOztBQUFBLDZCQUVBLFlBQUEsR0FBYyxJQUZkLENBQUE7O0FBSWEsSUFBQSx3QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsWUFBRCxHQUFvQixJQUFBLFlBQUEsQ0FBQSxDQUFwQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxHQUFtQixFQURuQixDQURXO0lBQUEsQ0FKYjs7QUFBQSw2QkFRQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsYUFBVyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEdBQUE7QUFFakIsY0FBQSxxQkFBQTtBQUFBLFVBQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBZixDQUFBLENBQUEsR0FBZ0MsQ0FBdEMsQ0FBQTtBQUFBLFVBQ0EsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZixDQUFBLENBQUEsR0FB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

//# sourceURL=/home/yggdrasil/.atom/packages/autocomplete-ruby/lib/autocomplete-ruby-provider.coffee
