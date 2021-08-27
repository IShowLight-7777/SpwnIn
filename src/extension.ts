// heres ur useless comment you wanted
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('spwnin.bobcode', () => {
		const bobcode = '
		bob = 1g 
		bob.move(10, -10, 2) ';
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
