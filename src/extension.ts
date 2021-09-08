
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
		const file = 'bob.spwn'; // i do not know why i need this but imma add it for refactoring in the future 

		if (fs.existsSync(folderPath)) {
			let filepath = path.join(folderPath, file);

			try {
				let exists = fs.existsSync(filepath);
				fs.writeFile(filepath, bobcode, err => {
					if(err){
						console.error(err);
						return vscode.window.showErrorMessage(`Failed to ${exists ? 'edit' : 'create'} "${file}" file.`);
					}
					return vscode.window.showWarningMessage(
						exists ? `FILE ALREADY EXISTS | edited "${file}" file.` : `created "${file}" file.`
					);
				});
			} catch(err) {
				console.error(err);
			}
					
		} else {
			return vscode.window.showErrorMessage(`Failed to create "${file}" file. are you in a workspace?`);
		}
	});
	let sampleontouch = vscode.commands.registerCommand('spwnin.ontouch', () => {
		let ontouch = `GROUP_ID = 1 // the group id rename "GROUP_ID" to whatever you want

on(touch(), !{
GROUP_ID.move(10, 10, 0.5) // moves the group 1 block up on the y axis and and 1 block on the x axis
//more code when player clicked/jumped
})`;
		const folderPath = vscode!.workspace!.workspaceFolders![0].uri.fsPath; 
		const file = 'testontouch.spwn';

		if (fs.existsSync(folderPath)) {
			let filepath = path.join(folderPath, file);

			try {
				let exists = fs.existsSync(filepath);
				fs.writeFile(filepath, ontouch, err => {
					if(err){
						console.error(err);
						return vscode.window.showErrorMessage(`Failed to ${exists ? 'edit' : 'create'} "${file}" file.`);
					}
					return vscode.window.showWarningMessage(
						exists ? `FILE ALREADY EXISTS | edited "${file}" file.` : `created "${file}" file.`
					);
				});
			} catch(err) {
				console.error(err);
			}
					
		} else {
			return vscode.window.showErrorMessage(`Failed to create "${file}" file. are you in a workspace or a folder?`);
		}
	});
	//push context
	// so apprenlty you dont need this for making new commands
	context.subscriptions.push(samplebobcode);
	context.subscriptions.push(sampleontouch); // outdated version
}

export function deactivate() {
	return vscode.window.showInformationMessage("Oh hi there. did we do something wrong?");
}
