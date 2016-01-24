(function() {
  var CompositeDisposable, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      executablePath: {
        "default": path.join(__dirname, '..', 'node_modules', 'htmlhint', 'bin', 'htmlhint'),
        type: 'string',
        description: 'HTMLHint Executable Path'
      }
    },
    activate: function() {
      console.log('activate linter-htmlhint');
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter-htmlhint.executablePath', (function(_this) {
        return function(executablePath) {
          return _this.executablePath = executablePath;
        };
      })(this)));
      return this.scopes = ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.handlebars', 'text.html.ruby'];
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    provideLinter: function() {
      var helpers, provider;
      helpers = require('atom-linter');
      return provider = {
        grammarScopes: this.scopes,
        scope: 'file',
        lintOnFly: true,
        lint: function(textEditor) {
          var filePath, htmlhintrc, parameters, text;
          filePath = textEditor.getPath();
          htmlhintrc = helpers.find(filePath, '.htmlhintrc');
          text = textEditor.getText();
          parameters = [filePath, '--format', 'json'];
          if (htmlhintrc && __indexOf.call(parameters, '-c') < 0) {
            parameters = parameters.concat(['-c', htmlhintrc]);
          }
          return helpers.execNode(atom.config.get('linter-htmlhint.executablePath'), parameters, {}).then(function(output) {
            var linterMessages, linterResults;
            linterResults = JSON.parse(output);
            if (!linterResults.length) {
              return [];
            }
            linterMessages = linterResults[0].messages;
            return linterMessages.map(function(msg) {
              return {
                range: [[msg.line - 1, msg.col - 1], [msg.line - 1, msg.col - 1]],
                type: msg.type,
                text: msg.message,
                filePath: filePath
              };
            });
          });
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1odG1saGludC9saWIvaW5pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBRkQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsY0FBQSxFQUNFO0FBQUEsUUFBQSxTQUFBLEVBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLGNBQTNCLEVBQTJDLFVBQTNDLEVBQXVELEtBQXZELEVBQThELFVBQTlELENBQVQ7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxXQUFBLEVBQWEsMEJBRmI7T0FERjtLQURGO0FBQUEsSUFLQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLDBCQUFaLENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUhqQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGdDQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxjQUFELEdBQUE7aUJBQ0UsS0FBQyxDQUFBLGNBQUQsR0FBa0IsZUFEcEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURpQixDQUFuQixDQUpBLENBQUE7YUFPQSxJQUFDLENBQUEsTUFBRCxHQUFXLENBQUMsbUJBQUQsRUFBc0IsaUJBQXRCLEVBQXlDLGVBQXpDLEVBQTBELGtCQUExRCxFQUE4RSxlQUE5RSxFQUErRixvQkFBL0YsRUFBcUgsc0JBQXJILEVBQTZJLGdCQUE3SSxFQVJIO0lBQUEsQ0FMVjtBQUFBLElBZUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQWZaO0FBQUEsSUFrQkEsYUFBQSxFQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsaUJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUFWLENBQUE7YUFDQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLGFBQUEsRUFBZSxJQUFDLENBQUEsTUFBaEI7QUFBQSxRQUNBLEtBQUEsRUFBTyxNQURQO0FBQUEsUUFFQSxTQUFBLEVBQVcsSUFGWDtBQUFBLFFBR0EsSUFBQSxFQUFNLFNBQUMsVUFBRCxHQUFBO0FBQ0osY0FBQSxzQ0FBQTtBQUFBLFVBQUEsUUFBQSxHQUFXLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FBWCxDQUFBO0FBQUEsVUFDQSxVQUFBLEdBQWEsT0FBTyxDQUFDLElBQVIsQ0FBYSxRQUFiLEVBQXVCLGFBQXZCLENBRGIsQ0FBQTtBQUFBLFVBRUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxPQUFYLENBQUEsQ0FGUCxDQUFBO0FBQUEsVUFHQSxVQUFBLEdBQWEsQ0FBQyxRQUFELEVBQVUsVUFBVixFQUFxQixNQUFyQixDQUhiLENBQUE7QUFLQSxVQUFBLElBQUcsVUFBQSxJQUFlLGVBQVksVUFBWixFQUFBLElBQUEsS0FBbEI7QUFDRSxZQUFBLFVBQUEsR0FBYSxVQUFVLENBQUMsTUFBWCxDQUFrQixDQUFDLElBQUQsRUFBTyxVQUFQLENBQWxCLENBQWIsQ0FERjtXQUxBO0FBUUEsaUJBQU8sT0FBTyxDQUFDLFFBQVIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUFqQixFQUFvRSxVQUFwRSxFQUFnRixFQUFoRixDQUFtRixDQUFDLElBQXBGLENBQXlGLFNBQUMsTUFBRCxHQUFBO0FBRTlGLGdCQUFBLDZCQUFBO0FBQUEsWUFBQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBWCxDQUFoQixDQUFBO0FBQ0EsWUFBQSxJQUFBLENBQUEsYUFBOEIsQ0FBQyxNQUEvQjtBQUFBLHFCQUFPLEVBQVAsQ0FBQTthQURBO0FBQUEsWUFFQSxjQUFBLEdBQWlCLGFBQWMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUZsQyxDQUFBO0FBR0EsbUJBQU8sY0FBYyxDQUFDLEdBQWYsQ0FBbUIsU0FBQyxHQUFELEdBQUE7cUJBQ3hCO0FBQUEsZ0JBQUEsS0FBQSxFQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSixHQUFTLENBQVYsRUFBYSxHQUFHLENBQUMsR0FBSixHQUFRLENBQXJCLENBQUQsRUFBMEIsQ0FBQyxHQUFHLENBQUMsSUFBSixHQUFTLENBQVYsRUFBYSxHQUFHLENBQUMsR0FBSixHQUFRLENBQXJCLENBQTFCLENBQVI7QUFBQSxnQkFDQSxJQUFBLEVBQU8sR0FBRyxDQUFDLElBRFg7QUFBQSxnQkFFQSxJQUFBLEVBQU8sR0FBRyxDQUFDLE9BRlg7QUFBQSxnQkFHQSxRQUFBLEVBQVcsUUFIWDtnQkFEd0I7WUFBQSxDQUFuQixDQUFQLENBTDhGO1VBQUEsQ0FBekYsQ0FBUCxDQVRJO1FBQUEsQ0FITjtRQUhXO0lBQUEsQ0FsQmY7R0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/yggdrasil/.atom/packages/linter-htmlhint/lib/init.coffee
