import * as vscode from  'vscode';
import { cleanCommentLine, CleanOptions } from './commentCleaner';
import { findCommentStartIndex } from './pythonUtils';

export function activate (context: vscode.ExtensionContext) {
	console.log('neat-note 已激活');

	const disposable = vscode.commands.registerCommand('neat-note.normalize', async () => {
		// 1. 获取当前活动编辑器
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage("请先打开一个文件");
			return;
		}

		// 2. 检查是否为 Python 文件
		if (editor.document.languageId != 'python') {
			vscode.window.showWarningMessage('neat-note 目前仅支持 Python 文件')
			return;
		}

		// 读取用户配置
		const config = vscode.workspace.getConfiguration('neat-note');
		const options: CleanOptions = {
			removeEmoji: config.get('removeEmoji', true),
			fixSpacing: config.get('fixSpacing', true),
		};

		const document = editor.document;
		const edits: vscode.TextEdit[] = [];

		// 3. 遍历每一行
		for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
			const line = document.lineAt(lineNum);
			const lineText = line.text;

			// 4. 查找注释位置
			const commentIndex = findCommentStartIndex(lineText);
			if (commentIndex !== -1) {
				// 5. 提取注释部分 (包含 # 符号)
				const commentPart = lineText.substring(commentIndex);

				// 传入配置选项
				const cleanedComment = cleanCommentLine(commentPart, options);

				// 7. 如果内容有变化，记录编辑操作
				if (commentPart !== cleanedComment) {
					const range = new vscode.Range(
						lineNum, commentIndex,
						lineNum, lineText.length
					);
					edits.push(vscode.TextEdit.replace(range, cleanedComment));
				}
			}
		}

		// 8. 应用所有编辑 (原子操作)
		if (edits.length > 0) {
			const workspaceEdit = new vscode.WorkspaceEdit();
			workspaceEdit.set(document.uri, edits);
			await vscode.workspace.applyEdit(workspaceEdit);
			vscode.window.showInformationMessage(`🧹 已清理 ${edits.length} 处注释`)
		} else {
			vscode.window.showInformationMessage('✨ 注释已经很规范了');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivated() {}