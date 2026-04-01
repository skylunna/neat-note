import emojiRegex from 'emoji-regex';

export interface CleanOptions {
    removeEmoji: boolean;
    fixSpacing: boolean;
}

const defaultOptions: CleanOptions = {
    removeEmoji: true,
    fixSpacing: true,
}

/**
 * 清洗单行注释文本
 * @param text 原始注释文本 (如 "# 🚀 启动")
 * @param options 配置选项
 * @returns 清洗后的文本
 */
export function cleanCommentLine(text: string, options: CleanOptions = defaultOptions): string {
    let result = text;

    // 1. 去除 Emoji
    if (options.removeEmoji) {
        const regex = emojiRegex();
        result = result.replace(regex, '');
    }

    // 2. 修复空格 (# 后必须有空格, 但 #! 除外)
    if (options.fixSpacing) {
        // 匹配 # 后紧跟非空格且不是 ! 的情况
        result = result.replace(/^(\s*#)(?!!)(\S)/, '$1 $2');
    }

    // 3. 去除末尾多余空白
    result = result.trimEnd()

    return result;
}