const vscode = require("vscode");
const axios = require("axios");
const https = require("https");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const authToken = process.env.API_KEY;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var editor;
async function NLToCode() {
  try {
    editor = vscode.window.activeTextEditor;
    const text = editor.document.getText(editor.selection);

    const response = await axios.post(
      process.env.Backend_Endpoint1,
      {
        prompt: text,
        temperature: 0,
        max_tokens: text.length * 5,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          authorization: "Bearer " + authToken,
        },
      }
    );
    return "\n" + response.data.choices[0].text + "\n";
  } catch (error) {
    // console.log(error.code);
    throw error;
  }
  
}

async function CodeTranslation() {
  editor = vscode.window.activeTextEditor;
  const text = editor.document.getText(editor.selection);

  const response = await axios.post(
    process.env.Backend_Endpoint2,
    {
      prompt: text,
      temperature: 0,
      max_tokens: 54,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["###"],
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  );
  return "\n" + response.data.choices[0].text;
}

async function ExplainCode() {
  editor = vscode.window.activeTextEditor;
  const text = editor.document.getText(editor.selection);

  const response = await axios.post(
    process.env.Backend_Endpoint2,
    {
      prompt: text + '\n"""\n Here\'s what the above code is doing:\n1.',
      temperature: 0,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['"""'],
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  );

  return '"""\n1. ' + response.data.choices[0].text + '"""\n';
}

async function calculateTimeComplexity() {
  editor = vscode.window.activeTextEditor;
  const text = editor.document.getText(editor.selection);

  const response = await axios.post(
    process.env.Backend_Endpoint2,
    {
      prompt: text,
      temperature: 0,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  );

  return "\n" + response.data.choices[0].text;
}

async function generatePythonDocstring() {
  editor = vscode.window.activeTextEditor;
  const text = editor.document.getText(editor.selection);

  const response = await axios.post(
    process.env.Backend_Endpoint2,
    {
      prompt: text,
      temperature: 0,
      max_tokens: 120,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  );

  return "\n" + response.data.choices[0].text;
}
async function bugFixer() {
  editor = vscode.window.activeTextEditor;
  const text = editor.document.getText(editor.selection);

  const response = await axios.post(
    process.env.Backend_Endpoint2,
    {
      prompt: text,
      temperature: 0,
      max_tokens: 510,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["###"],
    },
    {
      headers: {
        authorization: "Bearer " + authToken,
      },
    }
  );

  return "\n" + response.data.choices[0].text;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "JARVIS" is now active!');

  let disposable1 = vscode.commands.registerCommand(
    "extension.NLToCode",
    async () => {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Codemate: Generating Code...",
        cancellable: true,

      }, async (progress, token) => {

        NLToCode().then((replacement) => {

          const text = editor.document.getText(editor.selection);
          const position = editor.selection.active;
          var newPosition = position.with(position.line, text.length);
          var newSelection = new vscode.Selection(newPosition, newPosition);
  
          editor.selection = newSelection;
          editor.edit((editBuilder) => {
            editBuilder.replace(editor.selection, replacement);
  
          });
        })
        .catch((error) => {
          vscode.window.showErrorMessage(error.code);
          // console.log(error);
        });
      }
    );
    
    context.subscriptions.push(disposable1);
      })

      
  let disposable2 = vscode.commands.registerCommand(
    "extension.explainCode",
    async () => {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "CodeMate: Explaining Code...",
        cancellable: true,
      }, async (progress, token) => {

      ExplainCode().then((replacement) => {
        const text = editor.document.getText(editor.selection);
        const position = editor.selection.active;
        var newPosition = position.with(
          position.line - text.split("\n").length + 1,
          0
        );
        var newSelection = new vscode.Selection(newPosition, newPosition);

        editor.selection = newSelection;
        editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, replacement);
        });
      })
      .catch((error) => {
        vscode.window.showErrorMessage(error.code);
      });
    }
  );
  context.subscriptions.push(disposable2);
})

  let disposable3 = vscode.commands.registerCommand(
    "extension.calculateTimeComplexity",
    async () => {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "CodeMate: Calculating Time Complexity...",
        cancellable: true,
      }, async (progress, token) => {

      calculateTimeComplexity().then((replacement) => {
        const text = editor.document.getText(editor.selection);
        const position = editor.selection.active;
        var newPosition = position.with(
          position.line - text.split("\n").length + 1,
          0
        );
        var newSelection = new vscode.Selection(newPosition, newPosition);

        editor.selection = newSelection;
        editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, replacement);
        });
      })
      .catch((error) => {
        vscode.window.showErrorMessage(error.code);
      });
    }
  );
  context.subscriptions.push(disposable3);
})

  let disposable4 = vscode.commands.registerCommand(
    "extension.generatePythonDocstring",
    async () => {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "CodeMate: Generating Docstring...",
        cancellable: true,
      }, async (progress, token) => {

      generatePythonDocstring().then((replacement) => {
        const text = editor.document.getText(editor.selection);
        const position = editor.selection.active;
        var newPosition = position.with(
          position.line - text.split("\n").length + 1,
          0
        );
        var newSelection = new vscode.Selection(newPosition, newPosition);

        editor.selection = newSelection;
        editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, replacement);
        });
      })
      .catch((error) => {
        vscode.window.showErrorMessage(error.code);
      });
    }
  );
  context.subscriptions.push(disposable4);
  })

  let disposable5 = vscode.commands.registerCommand(
    "extension.bugFixer",
    async () => {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "CodeMate: Resolving Bugs...",
        cancellable: true,
        
      }, async (progress, token) => {

      bugFixer().then((replacement) => {
        const text = editor.document.getText(editor.selection);
        const position = editor.selection.active;
        var newPosition = position.with(
          position.line - text.split("\n").length + 1,
          0
        );
        var newSelection = new vscode.Selection(newPosition, newPosition);

        editor.selection = newSelection;
        editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, replacement);
        });
      })
      .catch((error) => {
        vscode.window.showErrorMessage(error.code);
      });
    }
  );
  context.subscriptions.push(disposable5);
  })

  let disposable6 = vscode.commands.registerCommand(
    "extension.codeTranslation",
    async () => {
      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "CodeMate: Translating Code...",
        cancellable: true,
      }, async (progress, token) => {

      CodeTranslation().then((replacement) => {
        const text = editor.document.getText(editor.selection);
        const position = editor.selection.active;
        var newPosition = position.with(
          position.line - text.split("\n").length + 1,
          0
        );
        var newSelection = new vscode.Selection(newPosition, newPosition);

        editor.selection = newSelection;
        editor.edit((editBuilder) => {
          editBuilder.replace(editor.selection, replacement);
        });
      })
      .catch((error) => {
        vscode.window.showErrorMessage(error.code);
      });
    }
  );
  context.subscriptions.push(disposable6);
  })

}
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
