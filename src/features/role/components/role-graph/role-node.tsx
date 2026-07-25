"use client";
import { memo } from "react";

import { BaseNode, BaseNodeContent } from "@/components/base-node";
import { Handle, NodeProps, Position } from "@xyflow/react";

export const RoleNode = memo(function RoleNode({ data }: NodeProps) {
  return (
    <BaseNode>
      <BaseNodeContent>{data.label as string}</BaseNodeContent>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </BaseNode>
  );
});

export const RoleNodeName = "SimpleBaseNode";
