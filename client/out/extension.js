"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const vsc = require("vscode");
const node_1 = require("vscode-languageclient/node");
let defaultClient;
const clients = new Map();
let _sortedWorkspaceFolders;
function sortedWorkspaceFolders() {
    if (_sortedWorkspaceFolders === void 0) {
        _sortedWorkspaceFolders = vsc.workspace.workspaceFolders ? vsc.workspace.workspaceFolders.map(folder => {
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
vsc.workspace.onDidChangeWorkspaceFolders(() => _sortedWorkspaceFolders = undefined);
function getOuterMostWorkspaceFolder(folder) {
    const sorted = sortedWorkspaceFolders();
    for (const element of sorted) {
        let uri = folder.uri.toString();
        if (uri.charAt(uri.length - 1) !== '/') {
            uri = uri + '/';
        }
        if (uri.startsWith(element)) {
            return vsc.workspace.getWorkspaceFolder(vsc.Uri.parse(element));
        }
    }
    return folder;
}
function activate(context) {
    const module = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const outputChannel = vsc.window.createOutputChannel('lsp-multi-server-example');
    function didOpenTextDocument(document) {
        // We are only interested in language mode text
        if (document.languageId !== "spwn" || (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled')) {
            return;
        }
        const uri = document.uri;
        // Untitled files go to a default client.
        if (uri.scheme === 'untitled' && !defaultClient) {
            const debugOptions = { execArgv: ["--nolazy", "--inspect=6010"] };
            const serverOptions = {
                run: { module, transport: node_1.TransportKind.ipc },
                debug: { module, transport: node_1.TransportKind.ipc, options: debugOptions }
            };
            const clientOptions = {
                documentSelector: [
                    { scheme: 'untitled', language: 'spwn' }
                ],
                diagnosticCollectionName: 'lsp-multi-server-example',
                outputChannel: outputChannel
            };
            defaultClient = new node_1.LanguageClient('lsp-multi-server-example', 'LSP Multi Server Example', serverOptions, clientOptions);
            defaultClient.start();
            return;
        }
        let folder = vsc.workspace.getWorkspaceFolder(uri);
        // Files outside a folder can't be handled. This might depend on the language.
        // Single file languages like JSON might handle files outside the workspace folders.
        if (!folder) {
            return;
        }
        // If we have nested workspace folders we only start a server on the outer most workspace folder.
        folder = getOuterMostWorkspaceFolder(folder);
        if (!clients.has(folder.uri.toString())) {
            const debugOptions = { execArgv: ["--nolazy", `--inspect=${6011 + clients.size}`] };
            const serverOptions = {
                run: { module, transport: node_1.TransportKind.ipc },
                debug: { module, transport: node_1.TransportKind.ipc, options: debugOptions }
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
    vsc.workspace.onDidOpenTextDocument(didOpenTextDocument);
    vsc.workspace.textDocuments.forEach(didOpenTextDocument);
    vsc.workspace.onDidChangeWorkspaceFolders((event) => {
        for (const folder of event.removed) {
            const client = clients.get(folder.uri.toString());
            if (client) {
                clients.delete(folder.uri.toString());
                client.stop();
            }
        }
    });
}
exports.activate = activate;
function deactivate() {
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