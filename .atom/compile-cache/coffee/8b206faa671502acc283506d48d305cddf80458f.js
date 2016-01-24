(function() {
  var CompositeDisposable, ScriptOptionsView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  module.exports = ScriptOptionsView = (function(_super) {
    __extends(ScriptOptionsView, _super);

    function ScriptOptionsView() {
      return ScriptOptionsView.__super__.constructor.apply(this, arguments);
    }

    ScriptOptionsView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top panel',
            outlet: 'scriptOptionsView'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Configure Run Options');
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Current Working Directory:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputCwd'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputCommand'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Command Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputCommandArgs'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Program Arguments:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputScriptArgs'
                });
              });
              _this.div({
                "class": 'block'
              }, function() {
                _this.label('Environment Variables:');
                return _this.input({
                  type: 'text',
                  "class": 'editor mini native-key-bindings',
                  outlet: 'inputEnv'
                });
              });
              return _this.div({
                "class": 'block'
              }, function() {
                var css;
                css = 'btn inline-block-tight';
                _this.button({
                  "class": "btn " + css,
                  click: 'close'
                }, 'Close');
                return _this.button({
                  "class": "btn " + css,
                  click: 'run'
                }, 'Run');
              });
            });
          });
        };
      })(this));
    };

    ScriptOptionsView.prototype.initialize = function(runOptions) {
      this.runOptions = runOptions;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'core:close': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'script:close-options': (function(_this) {
          return function() {
            return _this.toggleScriptOptions('hide');
          };
        })(this),
        'script:run-options': (function(_this) {
          return function() {
            return _this.toggleScriptOptions();
          };
        })(this),
        'script:save-options': (function(_this) {
          return function() {
            return _this.saveOptions();
          };
        })(this)
      }));
      atom.workspace.addTopPanel({
        item: this
      });
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.toggleScriptOptions = function(command) {
      switch (command) {
        case 'show':
          return this.scriptOptionsView.show();
        case 'hide':
          return this.scriptOptionsView.hide();
        default:
          return this.scriptOptionsView.toggle();
      }
    };

    ScriptOptionsView.prototype.saveOptions = function() {
      var splitArgs;
      splitArgs = function(element) {
        var item, _i, _len, _ref, _results;
        _ref = element.val().split(' ');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item !== '') {
            _results.push(item);
          }
        }
        return _results;
      };
      this.runOptions.workingDirectory = this.inputCwd.val();
      this.runOptions.cmd = this.inputCommand.val();
      this.runOptions.cmdArgs = splitArgs(this.inputCommandArgs);
      this.runOptions.env = this.inputEnv.val();
      return this.runOptions.scriptArgs = splitArgs(this.inputScriptArgs);
    };

    ScriptOptionsView.prototype.close = function() {
      return this.toggleScriptOptions('hide');
    };

    ScriptOptionsView.prototype.destroy = function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    ScriptOptionsView.prototype.run = function() {
      this.saveOptions();
      this.toggleScriptOptions('hide');
      return atom.commands.dispatch(this.workspaceView(), 'script:run');
    };

    ScriptOptionsView.prototype.workspaceView = function() {
      return atom.views.getView(atom.workspace);
    };

    return ScriptOptionsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvc2NyaXB0LW9wdGlvbnMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosd0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNILEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyx3QkFBUDtBQUFBLFlBQWlDLE1BQUEsRUFBUSxtQkFBekM7V0FBTCxFQUFtRSxTQUFBLEdBQUE7QUFDakUsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZUFBUDthQUFMLEVBQTZCLHVCQUE3QixDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLG1CQUFQO2FBQUwsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLGNBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxPQUFQO2VBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLGdCQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sNEJBQVAsQ0FBQSxDQUFBO3VCQUNBLEtBQUMsQ0FBQSxLQUFELENBQ0U7QUFBQSxrQkFBQSxJQUFBLEVBQU0sTUFBTjtB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

//# sourceURL=/home/yggdrasil/.atom/packages/script/lib/script-options-view.coffee
