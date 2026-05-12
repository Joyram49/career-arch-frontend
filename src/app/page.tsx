export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold" style={{ color: 'var(--brand-navy)' }}>
          CareerArch
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }} className="mt-2 text-lg">
          Phase 4A setup complete — building Phase 4B next.
        </p>
      </div>
    </main>
  );
}
