import { Edge, Node } from "@xyflow/react";
import { getRoleGraph } from "../role-query";
import RoleGraph from "./role-graph";

export default async function RoleGraphServer({ roleId }: { roleId: string }) {
  const { nodes: nodes_, edges: edges_ } = await getRoleGraph(roleId);

  const initialNodes: Node[] = nodes_.map((x) => ({
    id: x.id,
    position: { x: 0, y: 0 },
    data: { label: x.name },
  }));

  const initialEdges: Edge[] = edges_.map((x) => ({
    id: `${x.source}-${x.target}`,
    target: x.target,
    source: x.source,
  }));

  return <RoleGraph initialNodes={initialNodes} initialEdges={initialEdges} />;
}
