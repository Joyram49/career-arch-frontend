export function JobsTableSkeleton({ rows = 8 }: { rows?: number }): React.JSX.Element {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-5 py-3">
            <div className="space-y-1.5">
              <div className="h-3.5 w-36 rounded bg-muted" />
              <div className="h-2.5 w-24 rounded bg-muted" />
            </div>
          </td>
          <td className="px-5 py-3">
            <div className="h-3 w-16 rounded bg-muted" />
          </td>
          <td className="px-5 py-3">
            <div className="h-3 w-24 rounded bg-muted" />
          </td>
          <td className="px-5 py-3">
            <div className="h-3 w-8 rounded bg-muted" />
          </td>
          <td className="px-5 py-3">
            <div className="h-3 w-20 rounded bg-muted" />
          </td>
          <td className="px-5 py-3">
            <div className="h-5 w-16 rounded bg-muted" />
          </td>
          <td className="px-5 py-3">
            <div className="h-3 w-8 rounded bg-muted" />
          </td>
          <td className="px-5 py-3">
            <div className="ml-auto h-7 w-32 rounded bg-muted" />
          </td>
        </tr>
      ))}
    </>
  );
}
