(function() {
  var CompositeDisposable, Os, Path, disposables, fs, git, nothingToShow, notifier, prepFile, showFile, splitPane;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  nothingToShow = 'Nothing to show.';

  disposables = new CompositeDisposable;

  showFile = function(filePath) {
    return atom.workspace.open(filePath, {
      searchAllPanes: true
    }).then(function(textEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        return splitPane(atom.config.get('git-plus.splitPane'), textEditor);
      } else {
        return textEditor;
      }
    });
  };

  prepFile = function(text, filePath) {
    return new Promise(function(resolve, reject) {
      if ((text != null ? text.length : void 0) === 0) {
        return reject(nothingToShow);
      } else {
        return fs.writeFile(filePath, text, {
          flag: 'w+'
        }, function(err) {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  };

  module.exports = function(repo, _arg) {
    var args, diffFilePath, diffStat, file, _ref, _ref1;
    _ref = _arg != null ? _arg : {}, diffStat = _ref.diffStat, file = _ref.file;
    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
    if (file == null) {
      file = repo.relativize((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0);
    }
    if (!file) {
      return notifier.addError("No open file. Select 'Diff All'.");
    }
    args = ['diff', '--color=never'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (!diffStat) {
      args.push(file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
    }).then(function() {
      return showFile(diffFilePath);
    }).then(function(textEditor) {
      return disposables.add(textEditor.onDidDestroy(function() {
        return fs.unlink(diffFilePath);
      }));
    })["catch"](function(err) {
      if (err === nothingToShow) {
        return notifier.addInfo(err);
      } else {
        return notifier.addError(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJHQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUhMLENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FMTixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBTlgsQ0FBQTs7QUFBQSxFQU9BLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQVBaLENBQUE7O0FBQUEsRUFTQSxhQUFBLEdBQWdCLGtCQVRoQixDQUFBOztBQUFBLEVBV0EsV0FBQSxHQUFjLEdBQUEsQ0FBQSxtQkFYZCxDQUFBOztBQUFBLEVBYUEsUUFBQSxHQUFXLFNBQUMsUUFBRCxHQUFBO1dBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQThCO0FBQUEsTUFBQSxjQUFBLEVBQWdCLElBQWhCO0tBQTlCLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsU0FBQyxVQUFELEdBQUE7QUFDdkQsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsQ0FBSDtlQUNFLFNBQUEsQ0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLENBQVYsRUFBaUQsVUFBakQsRUFERjtPQUFBLE1BQUE7ZUFH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

//# sourceURL=/home/yggdrasil/.atom/packages/git-plus/lib/models/git-diff.coffee
