import { ContextTracker, ExternalTokenizer } from "@lezer/lr";
import {
  // created
  // indentation
  indent,
  dedent,
  // newlines
  newline as newlineToken,
  blankLineStart,
  newlineBracketed,
  eof,
  // existing
  GroupedExpressionNode,
  ArrayExpressionNode,
  DictionaryExpressionNode,
  CallExpressionNode,
  CallParamsExpressionNode,
  CallParamsLiteralExpressionNode,
  CallParamsParameterNode,
  // tokens
  ParenL,
  BracketL,
  BraceL,
} from "./parser.terms";

const bracketed = new Set([
  GroupedExpressionNode,
  ArrayExpressionNode,
  DictionaryExpressionNode,
  CallExpressionNode,
  CallParamsExpressionNode,
  CallParamsLiteralExpressionNode,
  CallParamsParameterNode,
]);

const newline = "\n".charCodeAt(0);
const carriageReturn = "\r".charCodeAt(0);
const space = " ".charCodeAt(0);
const tab = "\t".charCodeAt(0);
const hash = "#".charCodeAt(0);

class IndentLevel {
  constructor(parent, depth) {
    this.parent = parent;
    // -1 means this is not an actual indent level but a set of brackets
    this.depth = depth;
    this.hash =
      (parent ? (parent.hash + parent.hash) << 8 : 0) + depth + (depth << 4);
  }
}

const topIndent = new IndentLevel(null, 0);

function isLineBreak(ch) {
  return ch === newline || ch === carriageReturn;
}

export const newlines = new ExternalTokenizer(
  (input, stack) => {
    let prev;
    if (input.next < 0) {
      input.acceptToken(eof);
    } else if (stack.context.depth < 0) {
      if (isLineBreak(input.next)) {
        input.acceptToken(newlineBracketed, 1);
      }
    } else if (
      ((prev = input.peek(-1)) < 0 || isLineBreak(prev)) &&
      stack.canShift(blankLineStart)
    ) {
      let spaces = 0;
      while (input.next === space || input.next === tab) {
        input.advance();
        spaces++;
      }
      if (
        input.next === newline ||
        input.next === carriageReturn ||
        input.next === hash
      ) {
        input.acceptToken(blankLineStart, -spaces);
      }
    } else if (isLineBreak(input.next)) {
      input.acceptToken(newlineToken, 1);
    }
  },
  { contextual: true }
);

function countIndent(space) {
  let depth = 0;
  for (let i = 0; i < space.length; i++)
    depth += space.charCodeAt(i) === tab ? 8 - (depth % 8) : 1;
  return depth;
}

export const trackIndent = new ContextTracker({
  start: topIndent,
  reduce(context, term) {
    return context.depth < 0 && bracketed.has(term) ? context.parent : context;
  },
  shift(context, term, stack, input) {
    switch (term) {
      case indent:
        return new IndentLevel(
          context,
          countIndent(input.read(input.pos, stack.pos))
        );
      case dedent:
        return context.parent;
      case ParenL:
      case BracketL:
      case BraceL:
        return new IndentLevel(context, -1);
      default:
        return context;
    }
  },
  hash(context) {
    return context.hash;
  },
});

export const indentation = new ExternalTokenizer((input, stack) => {
  const contextDepth = stack.context.depth;
  if (contextDepth < 0) return;

  const prev = input.peek(-1);

  if (!(prev === newline || prev === carriageReturn)) {
    return;
  }

  let chars = 0;
  let depth = 0;

  while (true) {
    if (input.next === space) {
      depth++;
    } else if (input.next === tab) {
      depth += 8 - (depth % 8);
    } else {
      break;
    }

    input.advance();
    chars += 1;
  }

  if (
    depth !== contextDepth &&
    input.next !== newline &&
    input.next !== carriageReturn &&
    input.next !== hash
  ) {
    if (depth < contextDepth) {
      input.acceptToken(dedent, -chars);
    } else {
      input.acceptToken(indent);
    }
  }
});
