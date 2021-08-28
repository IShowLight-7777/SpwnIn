// heres ur useless comment you wanted

//MODULES 
import path = require('path');
import * as vscode from 'vscode';
import fs = require('fs');
// functions and blah blah blah
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('spwnin.bobcode', () => {
		let bobcode = `//the group you want to move
bob = 5g //your group
//where to move and what easing type
bob.move(10, -10, 2)`;

		// no longer fills my console with errors yay
		const folderPath = vscode!.workspace!.workspaceFolders![0].uri.fsPath; 

		if (fs.existsSync(folderPath)) {
			let filepath = `${folderPath}/bob.spwn`;

			try {
				if (fs.existsSync(filepath)) {
						fs.writeFile(path.join(folderPath, 'bob.spwn'), bobcode, err => {
							if(err){
								console.error(err);
								return vscode.window.showErrorMessage("Failed to create \"bob.spwn\" file.");
							}
							return vscode.window.showWarningMessage("FILE ALREADY EXISTS | edited \"bob.spwn\" file.");
							
						});
				} else {
						fs.writeFile(path.join(folderPath, 'bob.spwn'), bobcode, err => {
							if(err){
								console.error(err);
								return vscode.window.showErrorMessage("Failed to create \"bob.spwn\" file.");
							}
							return vscode.window.showInformationMessage("created \"bob.spwn\" file.");
						});
				}
			} catch(err) {
				console.error(err);
			}
					
		} else {
			return vscode.window.showErrorMessage("Failed to create \"bob.spwn\" file. are you in a workspace?");
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
