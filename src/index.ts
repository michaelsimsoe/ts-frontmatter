import * as yaml from 'js-yaml';

interface FrontMatterAttributes {
    [key: string]: any;
}

interface FrontMatterResult {
    attributes: FrontMatterAttributes;
    body: string;
    bodyBegin: number;
    frontmatter?: string;
}

const optionalByteOrderMark = '\\ufeff?';
const platform = typeof process !== 'undefined' ? process.platform : '';
const pattern = '^(' +
    optionalByteOrderMark +
    '(= yaml =|---)' +
    '$([\\s\\S]*?)' +
    '^(?:\\2|\\.\\.\\.)\\s*' +
    '$' +
    (platform === 'win32' ? '\\r?' : '') +
    '(?:\\n)?)';
const regex = new RegExp(pattern, 'm');

/**
 * Extracts front matter and body content from a string.
 * @param string - The input string containing front matter and body content.
 * @param options - Optional settings for the extraction process.
 * @returns An object containing the parsed front matter attributes, body content, and other metadata.
 */
function extractor(string: string, options: { allowUnsafe?: boolean } = { allowUnsafe: false }): FrontMatterResult {
    string = string || '';
    const defaultOptions = { allowUnsafe: false };
    options = { ...defaultOptions, ...options };

    const lines = string.split(/(\r?\n)/);
    if (lines[0] && /(= yaml =|---)/.test(lines[0])) {
        return parse(string);
    } else {
        return {
            attributes: {},
            body: string,
            bodyBegin: 1
        };
    }
}

/**
 * Computes the line number where the body content begins.
 * @param match - The regex match object.
 * @param body - The full content body string.
 * @returns The line number where the body content begins.
 */
function computeLocation(match: RegExpExecArray, body: string): number {
    let line = 1;
    let pos = body.indexOf('\n');
    const offset = match.index + match[0].length;

    while (pos !== -1) {
        if (pos >= offset) {
            return line;
        }
        line++;
        pos = body.indexOf('\n', pos + 1);
    }

    return line;
}

/**
 * Parses the string to extract front matter and body content.
 * @param string - The input string containing front matter and body content.
 * @returns An object containing the parsed front matter attributes, body content, and other metadata.
 */
function parse(string: string): FrontMatterResult {
    const match = regex.exec(string);
    if (!match) {
        return {
            attributes: {},
            body: string,
            bodyBegin: 1
        };
    }

    const yamlContent = match[match.length - 1].replace(/^\s+|\s+$/g, '');
    const attributes = (yaml.load(yamlContent) || {}) as FrontMatterAttributes;
    const body = string.replace(match[0], '');
    const line = computeLocation(match, string);

    return {
        attributes: attributes,
        body: body,
        bodyBegin: line,
        frontmatter: yamlContent
    };
}

/**
 * Tests if the given string contains front matter.
 * @param string - The input string to test.
 * @returns True if the string contains front matter, otherwise false.
 */
function test(string: string): boolean {
    string = string || '';
    return regex.test(string);
}

export { extractor, test, FrontMatterAttributes, FrontMatterResult };
