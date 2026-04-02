import * as vscode from  'vscode';
import { cleanCommentLine, CleanOptions } from './commentCleaner';
import { findCommentStartIndex } from './pythonUtils';
import { getCACertificates } from 'tls';

/**
 * 计算文档的所有编辑操作
 */
function normalizeDocument(document: vscode.TextDocument, options: CleanOptions): vscode.TextEdit[] {
	const edits: vscode.TextEdit[] = [];

	for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
		const line = document.lineAt(lineNum);
		const lineText = line.text;

		const commentIndex = findCommentStartIndex(lineText);

		if (commentIndex !== -1) {
			const commentPart = lineText.substring(commentIndex);
			const cleanedComment = cleanCommentLine(commentPart, options);

			if (commentPart !== cleanedComment) {
				const range = new vscode.Range(
					lineNum, commentIndex,
					lineNum, lineText.length
				);
				edits.push(vscode.TextEdit.replace(range, cleanedComment));
			}
		}
	}

	return edits;
}

export function activate (context: vscode.ExtensionContext) {
	console.log('neat-note 已激活');

	// 获取配置
	const getConfig = () => {
		const config = vscode.workspace.getConfiguration('neat-note');
		return {
			removeEmoji: config.get('removeEmoji', true),
			fixSpacing: config.get('fixSpacing', true),
		};
	};

	// 注册命令 (手动触发)
	const commandDisposable = vscode.commands.registerCommand('neat-note.normalize', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor || editor.document.languageId !== 'python') {
			vscode.window.showWarningMessage('neat-note 仅支持 Python 文件');
			return;
		}

		const edits = normalizeDocument(editor.document, getConfig());
		if (edits.length > 0) {
			const workspaceEdit = new vscode.WorkspaceEdit();
			workspaceEdit.set(editor.document.uri, edits);
			await vscode.workspace.applyEdit(workspaceEdit);
			vscode.window.showInformationMessage(`🧹 已清理 ${edits.length} 处注释`);
		} else {
			vscode.window.showInformationMessage('✨ 注释已经很规范了');
		}
		await applyEdits(editor.document, edits);
	});

	// 注册格式化提供者 (Shift+Alt+F / Format On Save)
	const formatProvider = vscode.languages.registerDocumentFormattingEditProvider('python', {
		provideDocumentFormattingEdits(document: vscode.TextDocument) : vscode.TextEdit[] {
			// 格式化提供者通常期望同步返回, 但我们有配置依赖
			// 这里直接返回编辑列表, vscode 会应用
			return normalizeDocument(document, getConfig())
		}
	});

	context.subscriptions.push(commandDisposable, formatProvider);
}

/**
 * 应用编辑
 */
async function applyEdits(document: vscode.TextDocument, edits: vscode.TextEdit[]) {
	if (edits.length > 0) {
		const workspaceEdit = new vscode.WorkspaceEdit();
		workspaceEdit.set(document.uri, edits);
		await vscode.workspace.applyEdit(workspaceEdit);
		vscode.window.showInformationMessage(`🧹 Neat Note 已清理 ${edits.length} 处注释`);
	} else {
		// 格式化时通常不弹窗打扰，但命令触发时可以提示
		// 尽在命令触发时，有上层控制，格式化提供者不弹窗
	}
}

export function deactivated() {}
