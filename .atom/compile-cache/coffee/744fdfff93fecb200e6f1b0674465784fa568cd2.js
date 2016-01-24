(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, dir, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, splitPane;

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(cwd) {
    return git.getConfig('commit.template', cwd).then(function(filePath) {
      if (filePath) {
        return fs.readFileSync(Path.get(filePath.trim())).toString().trim();
      } else {
        return '';
      }
    });
  };

  prepFile = function(status, filePath, diff) {
    var cwd;
    cwd = Path.dirname(filePath);
    return git.getConfig('core.commentchar', cwd).then(function(commentchar) {
      commentchar = commentchar ? commentchar.trim() : '#';
      status = status.replace(/\s*\(.*\)\n/g, "\n");
      status = status.trim().replace(/\n/g, "\n" + commentchar + " ");
      return getTemplate(cwd).then(function(template) {
        return fs.writeFileSync(filePath, "" + template + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status + "\n\n" + diff);
      });
    });
  };

  destroyCommitEditor = function() {
    var _ref;
    return (_ref = atom.workspace) != null ? _ref.getPanes().some(function(pane) {
      return pane.getItems().some(function(paneItem) {
        var _ref1;
        if (paneItem != null ? typeof paneItem.getURI === "function" ? (_ref1 = paneItem.getURI()) != null ? _ref1.includes('COMMIT_EDITMSG') : void 0 : void 0 : void 0) {
          if (pane.getItems().length === 1) {
            pane.destroy();
          } else {
            paneItem.destroy();
          }
          return true;
        }
      });
    }) : void 0;
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    })["catch"](function(data) {
      return notifier.addError(data);
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.unlink(filePath);
  };

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

  module.exports = function(repo, _arg) {
    var andPush, currentPane, filePath, init, stageChanges, startCommit, _ref;
    _ref = _arg != null ? _arg : {}, stageChanges = _ref.stageChanges, andPush = _ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        return prepFile(status, filePath, '');
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.add(textEditor.onDidSave(function() {
          return commit(dir(repo), filePath).then(function() {
            if (andPush) {
              return GitPush(repo);
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane, filePath);
        }));
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };
    if (stageChanges) {
      return git.add(repo, {
        update: stageChanges
      }).then(function() {
        return init();
      }).then(function() {
        return startCommit();
      });
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        if (message.includes('CRLF')) {
          return startCommit();
        } else {
          return notifier.addInfo(message);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0xBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBSk4sQ0FBQTs7QUFBQSxFQUtBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUxYLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FOWixDQUFBOztBQUFBLEVBT0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBUFYsQ0FBQTs7QUFBQSxFQVFBLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQVJWLENBQUE7O0FBQUEsRUFVQSxXQUFBLEdBQWMsR0FBQSxDQUFBLG1CQVZkLENBQUE7O0FBQUEsRUFZQSxHQUFBLEdBQU0sU0FBQyxJQUFELEdBQUE7V0FDSixDQUFDLEdBQUcsQ0FBQyxZQUFKLENBQUEsQ0FBQSxJQUFzQixJQUF2QixDQUE0QixDQUFDLG1CQUE3QixDQUFBLEVBREk7RUFBQSxDQVpOLENBQUE7O0FBQUEsRUFlQSxjQUFBLEdBQWlCLFNBQUMsSUFBRCxHQUFBO1dBQ2YsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFDLEtBQUQsR0FBQTtBQUN6QixNQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sSUFBZ0IsQ0FBbkI7ZUFDRSxHQUFHLENB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

//# sourceURL=/home/yggdrasil/.atom/packages/git-plus/lib/models/git-commit.coffee
