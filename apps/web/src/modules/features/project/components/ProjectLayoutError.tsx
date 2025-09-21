export default function ProjectLayoutError({ error }: { error: Error }) {
  return <div>{error.message}</div>;
}
