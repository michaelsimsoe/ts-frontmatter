"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractor = extractor;
exports.test = test;
var yaml = __importStar(require("js-yaml"));
var optionalByteOrderMark = '\\ufeff?';
var platform = typeof process !== 'undefined' ? process.platform : '';
var pattern = '^(' +
    optionalByteOrderMark +
    '(= yaml =|---)' +
    '$([\\s\\S]*?)' +
    '^(?:\\2|\\.\\.\\.)\\s*' +
    '$' +
    (platform === 'win32' ? '\\r?' : '') +
    '(?:\\n)?)';
var regex = new RegExp(pattern, 'm');
/**
 * Extracts front matter and body content from a string.
 * @param string - The input string containing front matter and body content.
 * @param options - Optional settings for the extraction process.
 * @returns An object containing the parsed front matter attributes, body content, and other metadata.
 */
function extractor(string, options) {
    if (options === void 0) { options = { allowUnsafe: false }; }
    string = string || '';
    var defaultOptions = { allowUnsafe: false };
    options = __assign(__assign({}, defaultOptions), options);
    var lines = string.split(/(\r?\n)/);
    if (lines[0] && /(= yaml =|---)/.test(lines[0])) {
        return parse(string);
    }
    else {
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
function computeLocation(match, body) {
    var line = 1;
    var pos = body.indexOf('\n');
    var offset = match.index + match[0].length;
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
function parse(string) {
    var match = regex.exec(string);
    if (!match) {
        return {
            attributes: {},
            body: string,
            bodyBegin: 1
        };
    }
    var yamlContent = match[match.length - 1].replace(/^\s+|\s+$/g, '');
    var attributes = (yaml.load(yamlContent) || {});
    var body = string.replace(match[0], '');
    var line = computeLocation(match, string);
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
function test(string) {
    string = string || '';
    return regex.test(string);
}
