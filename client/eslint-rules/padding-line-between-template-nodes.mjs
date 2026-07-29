const MESSAGE_ID = 'MISSING_PADDING_LINE_BETWEEN_TEMPLATE_NODES';
const NEWLINE = /\r\n|\n|\r/;
const COMMENT = /<!--[\s\S]*?-->/;

function hasPaddingLine(value) {
  return /\n[\t ]*\n/.test(value.replace(/\r\n?/g, '\n'));
}

function isWhitespaceText(node) {
  return node.type === 'Text';
}

function isIgnoredElement(node, ignoredElements) {
  return node.type === 'Element' && node.name && ignoredElements.has(node.name);
}

function nodeStart(node) {
  return node.sourceSpan?.start.offset;
}

function nodeEnd(node) {
  return node.sourceSpan?.end.offset;
}

/**
 * Finds the start of the trailing whitespace before the next node.
 *
 * Some Angular parser versions place an @let node's end offset immediately
 * before its semicolon. Replacing the complete gap would then remove that
 * semicolon. Limiting the replacement to trailing whitespace preserves every
 * non-whitespace character regardless of parser span behaviour.
 */
export function trailingWhitespaceStart(source, start, end) {
  const trailingWhitespace = source.slice(start, end).match(/[\t \r\n]*$/)?.[0];

  return end - (trailingWhitespace?.length ?? 0);
}

function newlineFor(source) {
  const firstNewline = source.match(NEWLINE)?.[0];

  return firstNewline === '\r\n' ? '\r\n' : firstNewline ?? '\n';
}

function indentationBefore(source, offset) {
  const lineStart = Math.max(
    source.lastIndexOf('\n', offset - 1),
    source.lastIndexOf('\r', offset - 1),
  ) + 1;

  const indentation = source.slice(lineStart, offset);

  return /^[\t ]*$/.test(indentation) ? indentation : '';
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Require at least one empty line between sibling Angular template nodes.',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          ignoredElements: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_ID]: 'Expected a padding line between template nodes.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const ignoredElements = new Set(context.options[0]?.ignoredElements ?? []);

    function checkSiblings(nodes) {
      const significantNodes = nodes.filter(node => !isWhitespaceText(node));

      for (let index = 0; index < significantNodes.length - 1; index += 1) {
        const current = significantNodes[index];
        const next = significantNodes[index + 1];
        const start = nodeEnd(current);
        const end = nodeStart(next);

        if (start === undefined || end === undefined || end < start) {
          continue;
        }

        const between = sourceCode.text.slice(start, end);

        if (
          hasPaddingLine(between)
          || COMMENT.test(between)
          || (current.type === 'LetDeclaration' && next.type === 'LetDeclaration')
          || isIgnoredElement(current, ignoredElements)
          || isIgnoredElement(next, ignoredElements)
        ) {
          continue;
        }

        const fixStart = trailingWhitespaceStart(sourceCode.text, start, end);

        context.report({
          loc: {
            start: sourceCode.getLocFromIndex(fixStart),
            end: sourceCode.getLocFromIndex(end),
          },
          messageId: MESSAGE_ID,
          fix(fixer) {
            const newline = newlineFor(sourceCode.text);
            const indentation = indentationBefore(sourceCode.text, end);

            return fixer.replaceTextRange(
              [fixStart, end],
              `${newline}${newline}${indentation}`,
            );
          },
        });
      }
    }

    function visitNode(node) {
      if (node.children) {
        checkSiblings(node.children);
        node.children.forEach(visitNode);
      }

      node.branches?.forEach(visitNode);
      node.cases?.forEach(visitNode);

      if (node.empty) {
        visitNode(node.empty);
      }
    }

    return {
      'Program:exit'(program) {
        const rootNodes = program.templateNodes ?? [];

        checkSiblings(rootNodes);
        rootNodes.forEach(visitNode);
      },
    };
  },
};
