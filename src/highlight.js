import { styleTags, tags as t } from "@lezer/highlight";

export const gdscriptHighlighting = styleTags({
  "for while if elif else return break continue pass assert await match case":
    t.controlKeyword,
  "in not and or is del": t.operatorKeyword,
  "func class class_name extends const var": t.definitionKeyword,
  "preload load": t.moduleKeyword,
  "as PI TAU INF NaN": t.keyword,
  True: t.bool,
  False: t.bool,
  Null: t.bool,
  Comment: t.lineComment,
  Number: t.number,
  String: t.string,
  UpdateOp: t.updateOperator,
  ArithOp: t.arithmeticOperator,
  BitOp: t.bitwiseOperator,
  CompareOp: t.compareOperator,
  AssignOp: t.definitionOperator,
  "ClassNode/Identifier ClassNode/ExtendsStatement/Identifier VariableNode/TypeCast/Type/Identifier":
    t.definition(t.className),
  "( )": t.paren,
  "[ ]": t.squareBracket,
  "{ }": t.brace,
  ".": t.derefOperator,
  ", ;": t.separator,
});
