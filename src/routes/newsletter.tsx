import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/newsletter')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/newsletter"!</div>
}
