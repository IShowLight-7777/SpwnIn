import * as path from 'path';
import {
	workspace as Workspace, window as Window, ExtensionContext, TextDocument, OutputChannel, WorkspaceFolder, Uri
} from 'vscode';

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
		_sortedWorkspaceFolders = Workspace.workspaceFolders ? Workspace.workspaceFolders.map(folder => {
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
Workspace.onDidChangeWorkspaceFolders(() => _sortedWorkspaceFolders = undefined);

function getOuterMostWorkspaceFolder(folder: WorkspaceFolder): WorkspaceFolder {
	const sorted = sortedWorkspaceFolders();
	for (const element of sorted) {
		let uri = folder.uri.toString();
		if (uri.charAt(uri.length - 1) !== '/') {
			uri = uri + '/';
		}
		if (uri.startsWith(element)) {
			return Workspace.getWorkspaceFolder(Uri.parse(element))!;
		}
	}
	return folder;
}

export function activate(context: ExtensionContext) {

	const outputChannel: OutputChannel = Window.createOutputChannel('lsp-multi-server-example');
			outputChannel.appendLine("amongus");

	function didOpenTextDocument(document: TextDocument): void {
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
		let folder = Workspace.getWorkspaceFolder(uri);
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

	Workspace.onDidOpenTextDocument(didOpenTextDocument);
	Workspace.textDocuments.forEach(didOpenTextDocument);
	Workspace.onDidChangeWorkspaceFolders((event) => {
		for (const folder  of event.removed) {
			const client = clients.get(folder.uri.toString());
			if (client) {
				clients.delete(folder.uri.toString());
				client.stop();
			}
		}
	});
}

export function deactivate(): Thenable<void> {
	const promises: Thenable<void>[] = [];
	if (defaultClient) {
		promises.push(defaultClient.stop());
	}
	for (const client of clients.values()) {
		promises.push(client.stop());
	}
	return Promise.all(promises).then(() => undefined);
}