const DefaultView = () => {
  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold text-gray-800">
        Welcome to Universal Messenger
      </h1>
      <p className="text-2xl text-gray-700">
        Select a conversation to start chatting.
      </p>
    </div>
  );
};

export default DefaultView;
