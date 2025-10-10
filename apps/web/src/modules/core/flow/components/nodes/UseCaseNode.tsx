import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UseCaseShape } from "@/modules/features/use-case-diagram/components/UseCaseShape";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { route } from "nextjs-routes";
import { useMemo, useState } from "react";

export default function UseCaseNode({ data, selected }: NodeProps<any>) {
  const name = data.name ?? "UseCase was deleted";
  const isDeleted = !data.name;

  const params = useParams<"/projects/[project-id]/use-case-diagram">();
  const projectId = params["project-id"];
  const router = useRouter();

  // hover state (controls handle visibility)
  const [hovered, setHovered] = useState(false);

  // Right-click context menu state
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuPosition(null);

  // Calculate dimensions to position handles correctly (same logic as UseCase component)
  const { svgWidth, svgHeight } = useMemo(() => {
    const maxWidth = 200;
    const minWidth = 100;
    const paddingX = 28;
    const paddingY = 14;
    const fontSize = 14;
    const lineHeight = 20;

    const avgCharWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor((maxWidth - paddingX * 2) / avgCharWidth);
    const lines = Math.max(1, Math.ceil(name.length / maxCharsPerLine));
    const textWidth = Math.min(name.length * avgCharWidth + paddingX * 2, maxWidth);
    const width = Math.max(minWidth, textWidth);
    const height = lines * lineHeight + paddingY * 2;

    return { svgWidth: width, svgHeight: height };
  }, [name]);

  // handles are visible only when hovered
  const handlesVisible = hovered || selected;

  return (
    <>
      <div
        style={{
          position: "relative",
          width: svgWidth,
          height: svgHeight,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onContextMenu={handleContextMenu}
        data-id={data?.id ?? undefined}
        title={name}
      >
        {/* LEFT HANDLES */}
        <Handle
          type="target"
          position={Position.Left}
          id="left-use-case-target"
          style={{
            left: handlesVisible ? -5 : 0,
            top: svgHeight / 2,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left-use-case-source"
          style={{
            left: handlesVisible ? -5 : 0,
            top: svgHeight / 2,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
          }}
        />

        {/* RIGHT HANDLES */}
        <Handle
          type="target"
          position={Position.Right}
          id="right-use-case-target"
          style={{
            right: handlesVisible ? -5 : 0,
            top: svgHeight / 2,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right-use-case-source"
          style={{
            right: handlesVisible ? -5 : 0,
            top: svgHeight / 2,
            background: "white",
            border: "none",
            opacity: handlesVisible ? 1 : 0,
            pointerEvents: handlesVisible ? "auto" : "none",
            transform: "translateY(-50%)",
          }}
        />

        <UseCaseShape name={name} selected={selected} isDeleted={isDeleted} />
      </div>

      {/* Context Menu */}
      {menuPosition && !isDeleted && (
        <DropdownMenu open onOpenChange={(open) => !open && closeMenu()}>
          <DropdownMenuContent
            sideOffset={0}
            className="min-w-48 bg-card text-popover-foreground border border-border shadow-lg rounded-xl p-1"
            style={{ position: "fixed", top: menuPosition.y, left: menuPosition.x }}
          >
            <DropdownMenuItem
              onSelect={() => {
                router.push(
                  route({
                    pathname: "/projects/[project-id]/use-cases",
                    query: {
                      "project-id": projectId,
                      useCaseId: data.id,
                    },
                  }),
                );
                closeMenu();
              }}
            >
              Navigate to Use Case
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
