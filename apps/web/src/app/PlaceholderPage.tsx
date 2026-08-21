export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-8 text-center">
      <div>
        <p className="text-sm text-muted-foreground">EchoClass</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">This page is part of the next feature slice.</p>
      </div>
    </div>
  );
}
