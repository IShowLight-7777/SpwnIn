// heres ur useless comment you wanted

//MODULES 
import path = require('path');
import * as vscode from 'vscode';
import fs = require('fs');
// functions and blah blah blah
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('spwnin.bobcode', () => {
		let bobcode = `bob = 5g
		bob.move(10, -10, 2)
		`;

		// returns an error if you don't have a workspace open which is bad
		let folderPath = vscode.workspace.workspaceFolders[0].uri // ignore this error as its only client side and oly occurs if theres no workspace open!
		.toString()
		.split(":")[0];

		fs.writeFile(path.join(folderPath, 'bob.spwn'), bobcode, err => {
			if(err){
				console.error(err);
				return vscode.window.showErrorMessage("Failed to create \"bob.spwn\" file.");
			}
			return vscode.window.showInformationMessage("created \"bob.spwn\" file.");

		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
