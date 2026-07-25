"use client";

import { Background, Edge, Node, ReactFlow } from "@xyflow/react";
import { RoleNode, RoleNodeName } from "./role-node";
import Dagre from "@dagrejs/dagre";

type RoleGraphProps = {
  initialNodes: Node[];
  initialEdges: Edge[];
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: "TB" | "LR" = "LR",
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 134,
      height: node.measured?.height ?? 87,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

export default function RoleGraphView({
  initialNodes,
  initialEdges,
}: RoleGraphProps) {
  const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);
  const nodeTypes = {
    [RoleNodeName]: RoleNode,
  };
  return (
    <div className="h-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        proOptions={{
          hideAttribution: true,
        }}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
