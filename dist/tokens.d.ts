export const newlines: ExternalTokenizer;
export const trackIndent: ContextTracker<IndentLevel>;
export const indentation: ExternalTokenizer;
import { ExternalTokenizer } from "@lezer/lr";
declare class IndentLevel {
    constructor(parent: any, depth: any);
    parent: any;
    depth: any;
    hash: any;
}
import { ContextTracker } from "@lezer/lr";
export {};
