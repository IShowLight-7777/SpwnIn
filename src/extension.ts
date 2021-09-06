
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';


export function activate(context: vscode.ExtensionContext) {
	let samplebobcode = vscode.commands.registerCommand('spwnin.bobcode', () => {
		let bobcode = `//the group you want to move
bob = 5g //your group
//where to move and what easing type
bob.move(10, -10, 2)`;

		const folderPath = vscode!.workspace!.workspaceFolders![0].uri.fsPath; 

		if (fs.existsSync(folderPath)) {
			let filepath = path.join(folderPath, 'bob.spwn');

			try {
				let exists = fs.existsSync(filepath);
				fs.writeFile(filepath, bobcode, err => {
					if(err){
						console.error(err);
						return vscode.window.showErrorMessage(`Failed to ${exists ? 'edit' : 'create'} "bob.spwn" file.`);
					}
					return vscode.window.showWarningMessage(
						exists ? 'FILE ALREADY EXISTS | edited "bob.spwn" file.' : 'created "bob.spwn" file.'
					);
				});
			} catch(err) {
				console.error(err);
			}
					
		} else {
			return vscode.window.showErrorMessage('Failed to create "bob.spwn" file. are you in a workspace?');
		}
	});
	context.subscriptions.push(samplebobcode);
}

export function deactivate() {
	return vscode.window.showInformationMessage("Oh hi there. did we do something wrong?");
}
