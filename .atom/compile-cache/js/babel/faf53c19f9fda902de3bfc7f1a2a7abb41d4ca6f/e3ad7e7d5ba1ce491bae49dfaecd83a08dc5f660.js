"use babel";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  config: {
    rubyExecutablePath: {
      type: "string",
      "default": "ruby"
    },
    ignoredExtensions: {
      type: 'array',
      "default": ['erb', 'md'],
      items: {
        type: 'string'
      }
    }
  },

  activate: function activate() {
    // We are now using steelbrain's package dependency package to install our
    //  dependencies.
    require("atom-package-deps").install();
  },

  provideLinter: function provideLinter() {
    var helpers = require("atom-linter");
    var Path = require("path");
    var regex = /.+:(\d+):\s*(.+?)[,:]\s(.+)/;
    return {
      name: "Ruby",
      grammarScopes: ["source.ruby", "source.ruby.rails", "source.ruby.rspec"],
      scope: "file",
      lintOnFly: true,
      lint: function lint(activeEditor) {
        var command = atom.config.get("linter-ruby.rubyExecutablePath");
        var ignored = atom.config.get("linter-ruby.ignoredExtensions");
        var filePath = activeEditor.getPath();
        var fileExtension = Path.extname(filePath).substr(1);

        for (var extension of ignored) {
          if (fileExtension === extension) return [];
        }

        return helpers.exec(command, ['-wc'], { stdin: activeEditor.getText(), stream: 'stderr' }).then(function (output) {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            var matches = regex.exec(line);
            if (matches === null) {
              return;
            }
            toReturn.push({
              range: helpers.rangeFromLineNumber(activeEditor, Number.parseInt(matches[1] - 1)),
              type: matches[2],
              text: matches[3],
              filePath: filePath
            });
          });
          return toReturn;
        });
      }
    };
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3lnZ2RyYXNpbC8uYXRvbS9wYWNrYWdlcy9saW50ZXItcnVieS9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHO0FBQ2IsUUFBTSxFQUFFO0FBQ04sc0JBQWtCLEVBQUU7QUFDbEIsVUFBSSxFQUFFLFFBQVE7QUFDZCxpQkFBUyxNQUFNO0tBQ2hCO0FBQ0QscUJBQWlCLEVBQUU7QUFDakIsVUFBSSxFQUFFLE9BQU87QUFDYixpQkFBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7QUFDdEIsV0FBSyxFQUFFO0FBQ0wsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0dBQ0Y7O0FBRUQsVUFBUSxFQUFFLG9CQUFNOzs7QUFHZCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUN4Qzs7QUFFRCxlQUFhLEVBQUUseUJBQU07QUFDbkIsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZDLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixRQUFNLEtBQUssR0FBRyw2QkFBNkIsQ0FBQztBQUM1QyxXQUFPO0FBQ0wsVUFBSSxFQUFFLE1BQU07QUFDWixtQkFBYSxFQUFFLENBQUMsYUFBYSxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDO0FBQ3hFLFdBQUssRUFBRSxNQUFNO0FBQ2IsZUFBUyxFQUFFLElBQUk7QUFDZixVQUFJLEVBQUUsY0FBQyxZQUFZLEVBQUs7QUFDdEIsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUNsRSxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ2pFLFlBQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QyxZQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdkQsYUFBSyxJQUFJLFNBQVMsSUFBSSxPQUFPLEVBQUU7QUFDN0IsY0FBSSxhQUFhLEtBQUssU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDO1NBQzVDOztBQUVELGVBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3RHLGNBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNsQixnQkFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDNUMsZ0JBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsZ0JBQUksT0FBTyxLQUFLLElBQUksRUFBRTtBQUNwQixxQkFBTzthQUNSO0FBQ0Qsb0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWixtQkFBSyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFFLENBQUM7QUFDbkYsa0JBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLGtCQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNoQixzQkFBUSxFQUFFLFFBQVE7YUFDbkIsQ0FBQyxDQUFDO1dBQ0osQ0FBQyxDQUFDO0FBQ0gsaUJBQU8sUUFBUSxDQUFDO1NBQ2pCLENBQUMsQ0FBQztPQUNKO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUveWdnZHJhc2lsLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1ydWJ5L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2UgYmFiZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjb25maWc6IHtcbiAgICBydWJ5RXhlY3V0YWJsZVBhdGg6IHtcbiAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICBkZWZhdWx0OiBcInJ1YnlcIlxuICAgIH0sXG4gICAgaWdub3JlZEV4dGVuc2lvbnM6IHtcbiAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICBkZWZhdWx0OiBbJ2VyYicsICdtZCddLFxuICAgICAgaXRlbXM6IHtcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYWN0aXZhdGU6ICgpID0+IHtcbiAgICAvLyBXZSBhcmUgbm93IHVzaW5nIHN0ZWVsYnJhaW4ncyBwYWNrYWdlIGRlcGVuZGVuY3kgcGFja2FnZSB0byBpbnN0YWxsIG91clxuICAgIC8vICBkZXBlbmRlbmNpZXMuXG4gICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyOiAoKSA9PiB7XG4gICAgY29uc3QgaGVscGVycyA9IHJlcXVpcmUoXCJhdG9tLWxpbnRlclwiKTtcbiAgICBjb25zdCBQYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG4gICAgY29uc3QgcmVnZXggPSAvLis6KFxcZCspOlxccyooLis/KVssOl1cXHMoLispLztcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogXCJSdWJ5XCIsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbXCJzb3VyY2UucnVieVwiLCBcInNvdXJjZS5ydWJ5LnJhaWxzXCIsIFwic291cmNlLnJ1YnkucnNwZWNcIl0sXG4gICAgICBzY29wZTogXCJmaWxlXCIsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiAoYWN0aXZlRWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItcnVieS5ydWJ5RXhlY3V0YWJsZVBhdGhcIik7XG4gICAgICAgIGNvbnN0IGlnbm9yZWQgPSBhdG9tLmNvbmZpZy5nZXQoXCJsaW50ZXItcnVieS5pZ25vcmVkRXh0ZW5zaW9uc1wiKTtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlRXh0ZW5zaW9uID0gUGF0aC5leHRuYW1lKGZpbGVQYXRoKS5zdWJzdHIoMSk7XG5cbiAgICAgICAgZm9yIChsZXQgZXh0ZW5zaW9uIG9mIGlnbm9yZWQpIHtcbiAgICAgICAgICBpZiAoZmlsZUV4dGVuc2lvbiA9PT0gZXh0ZW5zaW9uKSByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGVscGVycy5leGVjKGNvbW1hbmQsIFsnLXdjJ10sIHtzdGRpbjogYWN0aXZlRWRpdG9yLmdldFRleHQoKSwgc3RyZWFtOiAnc3RkZXJyJ30pLnRoZW4ob3V0cHV0ID0+IHtcbiAgICAgICAgICB2YXIgdG9SZXR1cm4gPSBbXTtcbiAgICAgICAgICBvdXRwdXQuc3BsaXQoL1xccj9cXG4vKS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGVzID0gcmVnZXguZXhlYyhsaW5lKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvUmV0dXJuLnB1c2goe1xuICAgICAgICAgICAgICByYW5nZTogaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKGFjdGl2ZUVkaXRvciwgTnVtYmVyLnBhcnNlSW50KChtYXRjaGVzWzFdIC0gMSkpKSxcbiAgICAgICAgICAgICAgdHlwZTogbWF0Y2hlc1syXSxcbiAgICAgICAgICAgICAgdGV4dDogbWF0Y2hlc1szXSxcbiAgICAgICAgICAgICAgZmlsZVBhdGg6IGZpbGVQYXRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn07XG4iXX0=
//# sourceURL=/home/yggdrasil/.atom/packages/linter-ruby/lib/main.js
