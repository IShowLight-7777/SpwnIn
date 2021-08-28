// heres ur useless comment you wanted

//MODULES 
import path = require('path');
import * as vscode from 'vscode';
import fs = require('fs');
// functions and blah blah blah
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('spwnin.bobcode', () => {
		let bobcode = `
			//the group you want to move
			bob = 5g //your group
			//where to move and what easing type
			bob.move(10, -10, 2)
		`;

		// no longer fills my console with errors yay
		const folderPath = vscode!.workspace!.workspaceFolders![0].uri.fsPath; 

		if (fs.existsSync(folderPath)) {
			let filepath = path.join(folderPath, 'bob.spwn');
			try {
				fs.writeFileSync(filepath, bobcode)
				return vscode.window.showWarningMessage('Created/edited "bob.spwn" file.');
			} catch(err) {
				console.error(err);
				return vscode.window.showErrorMessage('Failed to create/edit "bob.spwn" file.');
			}		
		} else {
			return vscode.window.showErrorMessage('Failed to create "bob.spwn" file. Are you in a workspace?');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
