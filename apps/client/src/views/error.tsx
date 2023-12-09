import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorView = () => {
  const error = useRouteError();
  let errorInfo = "";

  if (isRouteErrorResponse(error)) {
    errorInfo += `${error.status} ${error.statusText}`;

    if (error.data?.message) {
      errorInfo += `: ${error.data.message}`;
    }
  } else if (error instanceof Error) {
    errorInfo += error.message;
  }

  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold text-gray-800">An error occurred.</h1>
      <p className="font-mono text-2xl text-gray-700">{errorInfo}</p>
    </div>
  );
};

export default ErrorView;
