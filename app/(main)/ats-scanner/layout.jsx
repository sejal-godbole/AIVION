import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        <h1 className="text-5xl font-bold gradient-title">ATS Scanner</h1>
        {children}
      </Suspense>
    </div>
  );
}
