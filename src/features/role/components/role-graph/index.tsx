import { Edge, Node } from "@xyflow/react";
import { getRoleGraph } from "../../role-query";
import RoleGraphView from "./role-graph-view";
import { RoleNodeName } from "./role-node";
import { Suspense } from "react";

async function RoleGraphData({ roleId }: { roleId: string }) {
  const { nodes: nodes_, edges: edges_ } = await getRoleGraph(roleId);
  const initialNodes: Node[] = nodes_.map((x) => ({
    id: x.id,
    position: { x: 0, y: 0 },
    data: { label: x.name },
    type: RoleNodeName,
  }));

  const initialEdges: Edge[] = edges_.map((x) => ({
    id: `${x.source}-${x.target}`,
    target: x.target,
    source: x.source,
    animated: true,
    label: "继承自",
  }));

  return (
    <RoleGraphView initialNodes={initialNodes} initialEdges={initialEdges} />
  );
}

export default async function RoleGraph({ roleId }: { roleId: string }) {
  return (
    <Suspense>
      <RoleGraphData roleId={roleId} />
    </Suspense>
  );
}
