interface FrontMatterAttributes {
    [key: string]: any;
}
interface FrontMatterResult {
    attributes: FrontMatterAttributes;
    body: string;
    bodyBegin: number;
    frontmatter?: string;
}
/**
 * Extracts front matter and body content from a string.
 * @param string - The input string containing front matter and body content.
 * @param options - Optional settings for the extraction process.
 * @returns An object containing the parsed front matter attributes, body content, and other metadata.
 */
declare function extractor(string: string, options?: {
    allowUnsafe?: boolean;
}): FrontMatterResult;
/**
 * Tests if the given string contains front matter.
 * @param string - The input string to test.
 * @returns True if the string contains front matter, otherwise false.
 */
declare function test(string: string): boolean;
export { extractor, test, FrontMatterAttributes, FrontMatterResult };
