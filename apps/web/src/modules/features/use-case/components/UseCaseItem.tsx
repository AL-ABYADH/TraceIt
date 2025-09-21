import { UseCaseListDto } from "@repo/shared-schemas";

export default function UseCaseItem({ useCase }: { useCase: UseCaseListDto }) {
  return <div>{useCase.name}</div>;
}
