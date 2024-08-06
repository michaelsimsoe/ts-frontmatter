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

function extractor(string: string, options?: { allowUnsafe?: boolean }): FrontMatterResult {
    string = string || '';
    const defaultOptions = { allowUnsafe: false };
    options = options instanceof Object ? { ...defaultOptions, ...options } : defaultOptions;

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

    console.log('YAML Content:', yamlContent);
    console.log('Parsed Attributes:', attributes);
    console.log('Body:', JSON.stringify(body));

    return {
        attributes: attributes,
        body: body,
        bodyBegin: line,
        frontmatter: yamlContent
    };
}

function test(string: string): boolean {
    string = string || '';
    return regex.test(string);
}

export { extractor, test, FrontMatterAttributes, FrontMatterResult };
