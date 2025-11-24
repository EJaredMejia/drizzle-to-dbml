import type { CallExpression, Identifier, Literal } from "acorn";
import { simple } from "acorn-walk";

type CallbackTraversePropertyValue = (params: { keyNode: Identifier; valueNode: Literal }) => void;
export function astTraversePropertyValue(node: CallExpression, cb: CallbackTraversePropertyValue) {
  simple(node, {
    Property(node) {
      const keyNode = node.key;
      const valueNode = node.value;

      if (keyNode.type !== "Identifier") {
        return;
      }

      if (valueNode.type !== "Literal") {
        return;
      }

      cb({ keyNode, valueNode });
    },
  });
}
