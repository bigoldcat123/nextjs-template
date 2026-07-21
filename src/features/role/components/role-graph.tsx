import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Edge,
  Node,
  ReactFlow,
} from "@xyflow/react";
import { getRoleGraph } from "../role-query";
import { useCallback, useState } from "react";

export default async function RoleGraph({ roleId }: { roleId: string }) {
  const { nodes: nodes_, edges: edges_ } = await getRoleGraph(roleId);
  const initialNodes: Array<Node> = nodes_.map((x) => {
    return { id: x.id, position: { x: 0, y: 0 }, data: { lablel: x.name } };
  });
  const initialEdges: Array<Edge> = edges_.map((x) => {
    return {
      id: `${x.source}-${x.target}`,
      target: x.target,
      source: x.source,
    };
  });

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  return (
    <div className="h-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
