(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, dir, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile, splitPane,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../git');

  notifier = require('../notifier');

  splitPane = require('../splitPane');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = data.length; _i < _len; i = _i += 2) {
        mode = data[i];
        _results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return _results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1)
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(_arg) {
      var mode, path;
      mode = _arg.mode, path = _arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "deleted:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(_arg) {
      var path;
      path = _arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var _ref;
      return (_ref = p.path, __indexOf.call(currentPaths, _ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var lines, message, prevChangedFiles, prevMessage;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '';
    });
    prevMessage = [];
    prevChangedFiles = [];
    lines.forEach(function(line) {
      if (!/(([ MADRCU?!])\s(.*))/.test(line)) {
        return prevMessage.push(line);
      } else {
        return prevChangedFiles.push(line.replace(/[ MADRCU?!](\s)(\s)*/, line[0]));
      }
    });
    message = prevMessage.join('\n');
    return {
      message: message,
      prevChangedFiles: prevChangedFiles
    };
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = "" + (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(_arg) {
    var filePath, message, prevChangedFiles, status;
    message = _arg.message, prevChangedFiles = _arg.prevChangedFiles, status = _arg.status, filePath = _arg.filePath;
    return git.getConfig('core.commentchar', Path.dirname(filePath)).then(function(commentchar) {
      var currentChanges, nothingToCommit, replacementText, textToReplace;
      commentchar = commentchar.length > 0 ? commentchar.trim() : '#';
      status = cleanupUnstagedText(status);
      status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentchar + " ");
      if (prevChangedFiles.length > 0) {
        nothingToCommit = "nothing to commit, working directory clean";
        currentChanges = "committed:\n" + commentchar;
        textToReplace = null;
        if (status.indexOf(nothingToCommit) > -1) {
          textToReplace = nothingToCommit;
        } else if (status.indexOf(currentChanges) > -1) {
          textToReplace = currentChanges;
        }
        replacementText = "Changes to be committed:\n" + (prevChangedFiles.map(function(f) {
          return "" + commentchar + "   " + f;
        }).join("\n"));
        status = status.replace(textToReplace, replacementText);
      }
      return fs.writeFileSync(filePath, "" + message + "\n" + commentchar + " Please enter the commit message for your changes. Lines starting\n" + commentchar + " with '" + commentchar + "' will be ignored, and an empty message aborts the commit.\n" + commentchar + "\n" + commentchar + " " + status);
    });
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

  dir = function(repo) {
    return (git.getSubmodule() || repo).getWorkingDirectory();
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor();
      return git.refresh();
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.unlink(filePath);
  };

  module.exports = function(repo) {
    var currentPane, cwd, filePath;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg.message, prevChangedFiles = _arg.prevChangedFiles;
      return getStagedFiles(repo).then(function(files) {
        prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
        return {
          message: message,
          prevChangedFiles: prevChangedFiles
        };
      });
    }).then(function(_arg) {
      var message, prevChangedFiles;
      message = _arg.message, prevChangedFiles = _arg.prevChangedFiles;
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(dir(repo), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdC1hbWVuZC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMFFBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSlgsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUxaLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsR0FBQSxDQUFBLG1CQVBkLENBQUE7O0FBQUEsRUFTQSxtQkFBQSxHQUFzQixTQUFDLElBQUQsR0FBQTtBQUNwQixRQUFBLE9BQUE7QUFBQSxJQUFBLElBQWEsSUFBQSxLQUFRLEVBQXJCO0FBQUEsYUFBTyxFQUFQLENBQUE7S0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFpQixhQUR4QixDQUFBOzs7QUFFSztXQUFBLHNEQUFBO3VCQUFBO0FBQ0gsc0JBQUE7QUFBQSxVQUFDLE1BQUEsSUFBRDtBQUFBLFVBQU8sSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLEdBQUUsQ0FBRixDQUFsQjtVQUFBLENBREc7QUFBQTs7U0FIZTtFQUFBLENBVHRCLENBQUE7O0FBQUEsRUFlQSxxQkFBQSxHQUF3QixTQUFDLElBQUQsR0FBQTtXQUN0QjtBQUFB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

//# sourceURL=/home/yggdrasil/.atom/packages/git-plus/lib/models/git-commit-amend.coffee
