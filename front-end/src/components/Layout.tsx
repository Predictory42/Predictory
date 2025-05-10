import type { FC, PropsWithChildren } from "react";

import { Header } from "./Header";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen container mx-auto px-4 py-8 relative">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
};
