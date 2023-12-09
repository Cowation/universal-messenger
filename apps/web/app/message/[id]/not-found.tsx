export default function PostNotFound() {
  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-2 overflow-clip">
      <h1 className="text-3xl font-semibold text-neutral-700">404</h1>
      <p className="text-xl text-neutral-600">
        Looks like that user doesn{"'"}t exist.
      </p>
    </div>
  );
}
