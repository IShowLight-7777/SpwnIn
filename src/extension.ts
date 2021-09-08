
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import {
	Executable,
	LanguageClient, LanguageClientOptions, TransportKind,
	ServerOptions
} from 'vscode-languageclient/node';

let defaultClient: LanguageClient;
const clients: Map<string, LanguageClient> = new Map();

let _sortedWorkspaceFolders: string[] | undefined;
function sortedWorkspaceFolders(): string[] {
	if (_sortedWorkspaceFolders === void 0) {
		_sortedWorkspaceFolders = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.map(folder => {
			let result = folder.uri.toString();
			if (result.charAt(result.length - 1) !== '/') {
				result = result + '/';
			}
			return result;
		}).sort(
			(a, b) => {
				return a.length - b.length;
			}
		) : [];
	}
	return _sortedWorkspaceFolders;
}
vscode.workspace.onDidChangeWorkspaceFolders(() => _sortedWorkspaceFolders = undefined);

function getOuterMostWorkspaceFolder(folder: vscode.WorkspaceFolder): vscode.WorkspaceFolder {
	const sorted = sortedWorkspaceFolders();
	for (const element of sorted) {
		let uri = folder.uri.toString();
		if (uri.charAt(uri.length - 1) !== '/') {
			uri = uri + '/';
		}
		if (uri.startsWith(element)) {
			return vscode.workspace.getWorkspaceFolder(vscode.Uri.parse(element))!;
		}
	}
	return folder;
}


export function activate(context: vscode.ExtensionContext) {
	const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('lsp-multi-server-example');
			outputChannel.appendLine("smjs is a sussy baka"); // a little easter egg

	function didOpenTextDocument(document: vscode.TextDocument): void {
		if (document.languageId !=="spwn" || (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled')) {
			return;
		}

		const uri = document.uri;
		// Untitled files go to a default client.
		if (uri.scheme === 'untitled' && !defaultClient) {
			const debugOptions = { execArgv: ["--nolazy", "--inspect=6010"] };

			const run: Executable = {
				command: "spwn-lsp", // for now manually run in the root cargo install --path .
				options: {
					env: process.env
				}
			};

			const serverOptions: ServerOptions = {
				run,
				debug: run
			};

			const clientOptions: LanguageClientOptions = {
				documentSelector: [
					{ scheme: 'untitiled', language: 'spwn' }
				],
				diagnosticCollectionName: 'lsp-multi-server-example',
				outputChannel: outputChannel
			};

			defaultClient = new LanguageClient('lsp-multi-server-example', 'LSP Multi Server Example', serverOptions, clientOptions);
			defaultClient.start();
			return;
		}
		let folder = vscode.workspace.getWorkspaceFolder(uri);
		// Files outside a folder can't be handled. This might depend on the language.
		// Single file languages like JSON might handle files outside the workspace folders.
		if (!folder) {
			return;
		}
		// If we have nested workspace folders we only start a server on the outer most workspace folder.
		folder = getOuterMostWorkspaceFolder(folder);

		if (!clients.has(folder.uri.toString())) {
			const debugOptions = { execArgv: ["--nolazy", `--inspect=${6011 + clients.size}`] };
			const run: Executable = {
				command: "spwn-lsp", // for now manually run in the root cargo install --path .
				options: {
					env: process.env
				}
			};
			const serverOptions: ServerOptions = {
				run, 
				debug: run
			};
			const clientOptions: LanguageClientOptions = {
				documentSelector: [
					{ scheme: 'file', language: 'spwn', pattern: `${folder.uri.fsPath}/**/*` }
				],
				diagnosticCollectionName: 'lsp-multi-server-example',
				workspaceFolder: folder,
				outputChannel: outputChannel
			};
			const client = new LanguageClient('lsp-multi-server-example', 'LSP Multi Server Example', serverOptions, clientOptions);
			client.start();
			clients.set(folder.uri.toString(), client);
		}
	}

	vscode.workspace.onDidOpenTextDocument(didOpenTextDocument);
	vscode.workspace.textDocuments.forEach(didOpenTextDocument);
	vscode.workspace.onDidChangeWorkspaceFolders((event) => {
		for (const folder  of event.removed) {
			const client = clients.get(folder.uri.toString());
			if (client) {
				clients.delete(folder.uri.toString());
				client.stop();
			}
		}
	});

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

export function deactivate(): Thenable<void> {
	vscode.window.showInformationMessage("Oh hi there. did we do something wrong?");
	const promises: Thenable<void>[] = [];
	if (defaultClient) {
		promises.push(defaultClient.stop());
	}
	for (const client of clients.values()) {
		promises.push(client.stop());
	}
	return Promise.all(promises).then(() => undefined);
}
