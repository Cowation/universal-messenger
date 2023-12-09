// Import your Client Component

export default async function Page() {
  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-2 overflow-clip">
      <h1 className="text-3xl font-semibold text-neutral-700">
        Welcome to Universal Messenger
      </h1>
      <p className="text-xl text-neutral-600">Select a chat to get started.</p>
    </div>
  );
}
