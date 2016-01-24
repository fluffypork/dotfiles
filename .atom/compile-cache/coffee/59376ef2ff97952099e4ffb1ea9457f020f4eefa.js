(function() {
  var CompositeDisposable, ViewRuntimeObserver;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ViewRuntimeObserver = (function() {
    function ViewRuntimeObserver(view, subscriptions) {
      this.view = view;
      this.subscriptions = subscriptions != null ? subscriptions : new CompositeDisposable;
    }

    ViewRuntimeObserver.prototype.observe = function(runtime) {
      this.subscriptions.add(runtime.onDidExecuteStart((function(_this) {
        return function() {
          return _this.view.resetView();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidExecuteStop((function(_this) {
        return function() {
          return _this.view.stop();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStderr((function(_this) {
        return function(ev) {
          return _this.view.display('stderr', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidWriteToStdout((function(_this) {
        return function(ev) {
          return _this.view.display('stdout', ev.message);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidExit((function(_this) {
        return function(ev) {
          return _this.view.setHeaderAndShowExecutionTime(ev.returnCode, ev.executionTime);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotRun((function(_this) {
        return function(ev) {
          return _this.view.showUnableToRunError(ev.command);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidContextCreate((function(_this) {
        return function(ev) {
          var title;
          title = "" + ev.lang + " - " + (ev.filename + (ev.lineNumber != null ? ":" + ev.lineNumber : void 0));
          return _this.view.setHeaderTitle(title);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSpecifyLanguage((function(_this) {
        return function() {
          return _this.view.showNoLanguageSpecified();
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportLanguage((function(_this) {
        return function(ev) {
          return _this.view.showLanguageNotSupported(ev.lang);
        };
      })(this)));
      this.subscriptions.add(runtime.onDidNotSupportMode((function(_this) {
        return function(ev) {
          return _this.view.createGitHubIssueLink(ev.argType, ev.lang);
        };
      })(this)));
      return this.subscriptions.add(runtime.onDidNotBuildArgs((function(_this) {
        return function(ev) {
          return _this.view.handleError(ev.error);
        };
      })(this)));
    };

    ViewRuntimeObserver.prototype.destroy = function() {
      var _ref;
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    return ViewRuntimeObserver;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL3NjcmlwdC9saWIvdmlldy1ydW50aW1lLW9ic2VydmVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3Q0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNkJBQUUsSUFBRixFQUFTLGFBQVQsR0FBQTtBQUFtRCxNQUFsRCxJQUFDLENBQUEsT0FBQSxJQUFpRCxDQUFBO0FBQUEsTUFBM0MsSUFBQyxDQUFBLHdDQUFBLGdCQUFnQixHQUFBLENBQUEsbUJBQTBCLENBQW5EO0lBQUEsQ0FBYjs7QUFBQSxrQ0FFQSxPQUFBLEdBQVMsU0FBQyxPQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsaUJBQVIsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDM0MsS0FBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQUEsRUFEMkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFuQixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDMUMsS0FBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUEsRUFEMEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUFuQixDQUZBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixPQUFP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

//# sourceURL=/home/yggdrasil/.atom/packages/script/lib/view-runtime-observer.coffee
