"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const vscode = require("vscode");
const fs = require("fs");
const node_1 = require("vscode-languageclient/node");
let defaultClient;
const clients = new Map();
let _sortedWorkspaceFolders;
function sortedWorkspaceFolders() {
    if (_sortedWorkspaceFolders === void 0) {
        _sortedWorkspaceFolders = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.map(folder => {
            let result = folder.uri.toString();
            if (result.charAt(result.length - 1) !== '/') {
                result = result + '/';
            }
            return result;
        }).sort((a, b) => {
            return a.length - b.length;
        }) : [];
    }
    return _sortedWorkspaceFolders;
}
vscode.workspace.onDidChangeWorkspaceFolders(() => _sortedWorkspaceFolders = undefined);
function getOuterMostWorkspaceFolder(folder) {
    const sorted = sortedWorkspaceFolders();
    for (const element of sorted) {
        let uri = folder.uri.toString();
        if (uri.charAt(uri.length - 1) !== '/') {
            uri = uri + '/';
        }
        if (uri.startsWith(element)) {
            return vscode.workspace.getWorkspaceFolder(vscode.Uri.parse(element));
        }
    }
    return folder;
}
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel('lsp-multi-server-example');
    outputChannel.appendLine("smjs is a sussy baka"); // a little easter egg
    function didOpenTextDocument(document) {
        if (document.languageId !== "spwn" || (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled')) {
            return;
        }
        const uri = document.uri;
        // Untitled files go to a default client.
        if (uri.scheme === 'untitled' && !defaultClient) {
            const debugOptions = { execArgv: ["--nolazy", "--inspect=6010"] };
            const run = {
                command: "spwn-lsp",
                options: {
                    env: process.env
                }
            };
            const serverOptions = {
                run,
                debug: run
            };
            const clientOptions = {
                documentSelector: [
                    { scheme: 'untitiled', language: 'spwn' }
                ],
                diagnosticCollectionName: 'lsp-multi-server-example',
                outputChannel: outputChannel
            };
            defaultClient = new node_1.LanguageClient('lsp-multi-server-example', 'LSP Multi Server Example', serverOptions, clientOptions);
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
            const run = {
                command: "spwn-lsp",
                options: {
                    env: process.env
                }
            };
            const serverOptions = {
                run,
                debug: run
            };
            const clientOptions = {
                documentSelector: [
                    { scheme: 'file', language: 'spwn', pattern: `${folder.uri.fsPath}/**/*` }
                ],
                diagnosticCollectionName: 'lsp-multi-server-example',
                workspaceFolder: folder,
                outputChannel: outputChannel
            };
            const client = new node_1.LanguageClient('lsp-multi-server-example', 'LSP Multi Server Example', serverOptions, clientOptions);
            client.start();
            clients.set(folder.uri.toString(), client);
        }
    }
    vscode.workspace.onDidOpenTextDocument(didOpenTextDocument);
    vscode.workspace.textDocuments.forEach(didOpenTextDocument);
    vscode.workspace.onDidChangeWorkspaceFolders((event) => {
        for (const folder of event.removed) {
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
        const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const file = 'bob.spwn'; // i do not know why i need this but imma add it for refactoring in the future 
        if (fs.existsSync(folderPath)) {
            let filepath = path.join(folderPath, file);
            try {
                let exists = fs.existsSync(filepath);
                fs.writeFile(filepath, bobcode, err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(`Failed to ${exists ? 'edit' : 'create'} "${file}" file.`);
                    }
                    return vscode.window.showWarningMessage(exists ? `FILE ALREADY EXISTS | edited "${file}" file.` : `created "${file}" file.`);
                });
            }
            catch (err) {
                console.error(err);
            }
        }
        else {
            return vscode.window.showErrorMessage(`Failed to create "${file}" file. are you in a workspace?`);
        }
    });
    let sampleontouch = vscode.commands.registerCommand('spwnin.ontouch', () => {
        let ontouch = `GROUP_ID = 1 // the group id rename "GROUP_ID" to whatever you want

on(touch(), !{
GROUP_ID.move(10, 10, 0.5) // moves the group 1 block up on the y axis and and 1 block on the x axis
//more code when player clicked/jumped
})`;
        const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        const file = 'testontouch.spwn';
        if (fs.existsSync(folderPath)) {
            let filepath = path.join(folderPath, file);
            try {
                let exists = fs.existsSync(filepath);
                fs.writeFile(filepath, ontouch, err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(`Failed to ${exists ? 'edit' : 'create'} "${file}" file.`);
                    }
                    return vscode.window.showWarningMessage(exists ? `FILE ALREADY EXISTS | edited "${file}" file.` : `created "${file}" file.`);
                });
            }
            catch (err) {
                console.error(err);
            }
        }
        else {
            return vscode.window.showErrorMessage(`Failed to create "${file}" file. are you in a workspace or a folder?`);
        }
    });
    //push context
    // so apprenlty you dont need this for making new commands
    context.subscriptions.push(samplebobcode);
    context.subscriptions.push(sampleontouch); // outdated version
}
exports.activate = activate;
function deactivate() {
    vscode.window.showInformationMessage("Oh hi there. did we do something wrong?");
    const promises = [];
    if (defaultClient) {
        promises.push(defaultClient.stop());
    }
    for (const client of clients.values()) {
        promises.push(client.stop());
    }
    return Promise.all(promises).then(() => undefined);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map