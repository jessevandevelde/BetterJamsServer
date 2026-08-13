const MESSAGE_ID = 'UNNECESSARY_NEWLINE';
const NEWLINE = /\r\n|\n|\r/;

function isWhitespaceText(node) {
  return node.type === 'Text';
}

function isIgnoredElement(node, ignoredElements) {
  return node.type === 'Element' && node.name && ignoredElements.has(node.name);
}

function newlineFor(source) {
  const firstNewline = source.match(NEWLINE)?.[0];

  return firstNewline === '\r\n' ? '\r\n' : firstNewline ?? '\n';
}

function hasTooManyNewlines(value, maximum) {
  if (!/^[\t \r\n]*$/.test(value)) {
    return false;
  }

  const normalized = value.replace(/\r\n?|\n/g, '\n');

  return normalized.split('\n').length - 1 > maximum;
}

function indentationAtEnd(value) {
  return value.match(/[\t ]*$/)?.[0] ?? '';
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Remove unnecessary whitespace between template nodes.',
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
      [MESSAGE_ID]: 'Unnecessary newline.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;
    const ignoredElements = new Set(context.options[0]?.ignoredElements ?? []);

    function reportWhitespace(start, end, maximum) {
      if (end < start) {
        return;
      }

      const whitespace = sourceCode.text.slice(start, end);

      if (!hasTooManyNewlines(whitespace, maximum)) {
        return;
      }

      context.report({
        loc: {
          start: sourceCode.getLocFromIndex(start),
          end: sourceCode.getLocFromIndex(end),
        },
        messageId: MESSAGE_ID,
        fix(fixer) {
          const newline = newlineFor(whitespace || sourceCode.text);
          const indentation = indentationAtEnd(whitespace);

          return fixer.replaceTextRange(
            [start, end],
            `${newline.repeat(maximum)}${indentation}`,
          );
        },
      });
    }

    function significantNodes(nodes) {
      return nodes.filter(node => !isWhitespaceText(node));
    }

    function checkSiblings(nodes) {
      const siblings = significantNodes(nodes);

      for (let index = 0; index < siblings.length - 1; index += 1) {
        const current = siblings[index];
        const next = siblings[index + 1];

        if (
          !current.sourceSpan
          || !next.sourceSpan
          || isIgnoredElement(current, ignoredElements)
          || isIgnoredElement(next, ignoredElements)
        ) {
          continue;
        }

        reportWhitespace(
          current.sourceSpan.end.offset,
          next.sourceSpan.start.offset,
          2,
        );
      }
    }

    function checkElementEdges(node) {
      if (
        node.type !== 'Element'
        || !node.startSourceSpan
        || !node.endSourceSpan
        || isIgnoredElement(node, ignoredElements)
      ) {
        return;
      }

      const children = significantNodes(node.children ?? []);

      if (children.length === 0) {
        return;
      }

      const first = children[0];
      const last = children.at(-1);

      if (first.sourceSpan && !isIgnoredElement(first, ignoredElements)) {
        reportWhitespace(
          node.startSourceSpan.end.offset,
          first.sourceSpan.start.offset,
          1,
        );
      }

      if (last?.sourceSpan && !isIgnoredElement(last, ignoredElements)) {
        reportWhitespace(
          last.sourceSpan.end.offset,
          node.endSourceSpan.start.offset,
          1,
        );
      }
    }

    function visitNode(node) {
      checkElementEdges(node);

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
