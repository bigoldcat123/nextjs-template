"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { navItems } from "@/lib/nav-items";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

/** 静态路径 → 中文标签（根节点 + 共享导航配置） */
const labels: Record<string, string> = {
  "/dashboard": "仪表盘",
  ...Object.fromEntries(navItems.map((item) => [item.url, item.title])),
};

/** 动态段（id）的兜底标签：父路径 → 末段文案 */
const dynamicLabels: Record<string, string> = {
  "/dashboard/role": "角色详情",
};

type Crumb = {
  label: string;
  href: string;
};

function useCrumbs(pathname: string): Crumb[] {
  // return React.useMemo(() => {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  let path = "";

  segments.forEach((segment, index) => {
    const parent = path;
    path += `/${segment}`;
    const isLast = index === segments.length - 1;
    const label = labels[path] ?? (isLast ? dynamicLabels[parent] : null);
    if (label) {
      crumbs.push({ label, href: path });
    }
  });

  return crumbs;
  // }, [pathname]);
}

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const crumbs = useCrumbs(pathname);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
