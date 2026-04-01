import * as vscode from 'vscode'
import { cleanCommentLine } from './commentCleaner'

export function activate (context: vscode.ExtensionContext) {
	console.log('neat-note 已激活');

	const disposable = vscode.commands.registerCommand('neat-note.normalize', () => {
		// 测试用例
		const testCases = [
			'# 🚀 启动服务',
			'#fix bug',
			'# 多余空格',
			'#!/usr/bin/env python3',
			'# ✅ 测试通过',
		];

		let output = '🧹 清洗结果:\n\n';
		testCases.forEach(tc => {
			const cleaned = cleanCommentLine(tc);
			output += `原：${tc}\n`;
            output += `后：${cleaned}\n\n`;
		});

		vscode.window.showInformationMessage(output);
	});

	context.subscriptions.push(disposable);
}

export function deactivated() {}