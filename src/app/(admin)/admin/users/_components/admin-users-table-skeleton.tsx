import React from 'react';

export function UsersTableSkeleton({ rows = 8 }: { rows?: number }): React.JSX.Element {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-muted" />

              <div className="space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-muted" />
                <div className="h-2.5 w-36 rounded bg-muted" />
              </div>
            </div>
          </td>

          <td className="px-5 py-3">
            <div className="h-5 w-14 rounded bg-muted" />
          </td>

          <td className="px-5 py-3">
            <div className="h-5 w-16 rounded bg-muted" />
          </td>

          <td className="px-5 py-3">
            <div className="h-3 w-20 rounded bg-muted" />
          </td>

          <td className="px-5 py-3">
            <div className="h-3 w-20 rounded bg-muted" />
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
