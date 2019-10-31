/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as vscode from "vscode";
import ExtensionUtils from "./utils/ExtensionUtils";

export const activate = (context: vscode.ExtensionContext) => {
    try {
        ExtensionUtils.setupBalLangServerPlugins(context.extensionPath);
        const command = "celleryExtension.build";
        const commandHandler = async (name: string = "buildCell") => {
            const cellName = await vscode.window.showInputBox({ placeHolder: "org-name/image-name:version" });
            const vars = {
                file: vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.fileName : null,
                cwd: vscode.workspace.rootPath ||  require("os").homedir(),
            }
            if (cellName) {
                const celleryBuildCommand = `cellery build ${vars.file} ${cellName}`;
                const terminal = vscode.window.createTerminal({ name, cwd: vars.cwd });
                terminal.show(true)
                if (vars.file !== null) {
                    terminal.sendText(celleryBuildCommand);
                }
            }
        };

        context.subscriptions.push(vscode.commands.registerCommand(command, commandHandler));
    } catch (error) {
        vscode.window.showErrorMessage("Failed to install Cellery code completion plugins");
        throw error;
    }

};

export const deactivate = () => {
    // Do nothing
};
