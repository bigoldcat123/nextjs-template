import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserKey } from "lucide-react";

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserKey className="size-5" />
            角色详情
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">角色 ID: {id}</p>
        </CardContent>
      </Card>
    </div>
  );
}
