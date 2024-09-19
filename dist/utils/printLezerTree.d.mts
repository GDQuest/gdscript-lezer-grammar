import { Input, NodeType, SyntaxNode, Tree, TreeCursor } from "@lezer/common";
export declare function sliceType(cursor: TreeCursor, input: Input, type: number): string | null;
export declare function isType(cursor: TreeCursor, type: number): boolean;
export type CursorNode = {
    type: NodeType;
    from: number;
    to: number;
    isLeaf: boolean;
};
export type TreeTraversal = {
    beforeEnter?: (cursor: TreeCursor) => void;
    onEnter: (node: CursorNode) => false | void;
    onLeave?: (node: CursorNode) => false | void;
};
type TreeTraversalOptions = {
    from?: number;
    to?: number;
    includeParents?: boolean;
} & TreeTraversal;
export declare function traverseTree(cursor: TreeCursor | Tree | SyntaxNode, { from, to, includeParents, beforeEnter, onEnter, onLeave, }: TreeTraversalOptions): void;
export declare function validatorTraversal(input: Input | string, { fullMatch }?: {
    fullMatch?: boolean;
}): {
    state: {
        valid: boolean;
        parentNodes: CursorNode[];
        lastLeafTo: number;
    };
    traversal: TreeTraversal;
};
export declare function validateTree(tree: TreeCursor | Tree | SyntaxNode, input: Input | string, options?: {
    fullMatch?: boolean;
}): boolean;
type PrintTreeOptions = {
    from?: number;
    to?: number;
    start?: number;
    includeParents?: boolean;
    doNotColorize?: boolean;
};
export declare function printTree(cursor: TreeCursor | Tree | SyntaxNode, input: Input | string, { from, to, start, includeParents, doNotColorize, }?: PrintTreeOptions): string;
export declare function logTree(tree: TreeCursor | Tree | SyntaxNode, input: string, options?: PrintTreeOptions): void;
export {};
