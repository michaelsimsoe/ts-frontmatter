import { extractor, test, FrontMatterResult } from '../src';

const exampleMarkdown = `---
title: "Hello Blog"
date: "2024-08-05"
updated: "2024-08-06"
tags:
  - javascript
---
This is my first blog post written in Markdown.
`;

describe('extractor function', () => {
  it('should extract front matter and body', () => {
    const result: FrontMatterResult = extractor(exampleMarkdown);

    console.log('Extracted Result:', result);

    expect(result.attributes.title).toBe("Hello Blog");
    expect(result.attributes.date).toBe("2024-08-05");
    expect(result.body.trim()).toBe("This is my first blog post written in Markdown.");
    expect(result.bodyBegin).toBe(8); // Line number where the body begins
  });

  it('should return empty attributes and entire body if no front matter', () => {
    const markdownWithoutFrontMatter = 'This is just a markdown file without front matter.';
    const result: FrontMatterResult = extractor(markdownWithoutFrontMatter);

    expect(result.attributes).toEqual({});
    expect(result.body).toBe(markdownWithoutFrontMatter);
    expect(result.bodyBegin).toBe(1);
  });
});

describe('test function', () => {
  it('should return true if front matter is present', () => {
    expect(test(exampleMarkdown)).toBe(true);
  });

  it('should return false if no front matter is present', () => {
    const markdownWithoutFrontMatter = 'This is just a markdown file without front matter.';
    expect(test(markdownWithoutFrontMatter)).toBe(false);
  });
});
