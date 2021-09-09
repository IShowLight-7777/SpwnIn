
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';


export function activate(context: vscode.ExtensionContext) {

	let samplebobcode = vscode.commands.registerCommand('spwnin.bobcode', () => {
		let bobcode = `//the group you want to move
bob = 5g //your group
//where to move and what easing type
bob.move(10, -10, 2)`;
		const options: vscode.OpenDialogOptions = {
			canSelectMany: false,
			openLabel: 'Open',
			filters: {
			   'Spwn files': ['spwn'], // typescript stfu i dont want problems 	
			   'All files': ['*']
		   }
		};

		
		const folderPath = vscode!.workspace!.workspaceFolders![0].uri.fsPath; 
		const file = 'bob.spwn'; // i do not know why i need this but imma add it for refactoring in the future 

		if (fs.existsSync(folderPath)) {
			vscode.window.showOpenDialog(options).then(fileUri => {
				if (fileUri && fileUri[0]) {
					let filepath = fileUri[0].fsPath;

					try {
								console.log('Selected file: ' + fileUri[0].fsPath);
									fs.writeFile(filepath, bobcode, err => {
										if(err){
											console.error(err);
											vscode.window.showErrorMessage(`Failed to edit "${fileUri[0].fsPath}"`);
											return vscode.window.showErrorMessage(`${err}`);
										}
										return vscode.window.showWarningMessage(
											`edited "${fileUri[0].fsPath}"`
										);
									});
							
						
						
					} catch(err) {
						console.error(err);
					}
				}
			});
		
		} else {
			return vscode.window.showErrorMessage(`Failed to edit "${file}" file. are you in a workspace?`);
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
	let doughnut = vscode.commands.registerCommand('spwnin.doughnut', () => {
		let donut = `
			 extract $; let		
		 v=[];extract obj_props
	  p=3.14;h=100;d=sin;u=cos;for
	i in..20..628{for j in..40..628{
   }t=d(i/h);c=u(i/h);s=d(j/h;p=u(j/h
  );x=3*c+p*c;y=3*t+p*t;g=?g;a=1/(s+5)
 add(obj{1:725,X:615+40*a*(x*5),Y:415 +
 40*a*(y*5),57:g});v.push([x,y,s,g]);)}
 r=(a,i){c,u(a*p/      180);s=d(a*p/180
);n=i[0];m=i[1];        l=i[2];z=(-s)*n+
}
		`;

		const folderPath = vscode!.workspace!.workspaceFolders![0].uri.fsPath; 
		const file = 'donut.spwn';

		if (fs.existsSync(folderPath)) {
			let filepath = path.join(folderPath, file);

			try {
				let exists = fs.existsSync(filepath);
				fs.writeFile(filepath, donut, err => {
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
	context.subscriptions.push(doughnut);
}

export function deactivate() {
	vscode.window.showInformationMessage("Oh hi there. did we do something wrong?");
}
