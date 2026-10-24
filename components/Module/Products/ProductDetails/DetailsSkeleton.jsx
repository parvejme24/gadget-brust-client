export default function DetailsSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-4 w-64 rounded bg-gray-100" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-gray-100" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-gray-100" />
          <div className="h-8 w-3/4 rounded bg-gray-100" />
          <div className="h-4 w-40 rounded bg-gray-100" />
          <div className="h-28 rounded-2xl bg-gray-100" />
          <div className="h-12 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
