import { type FC } from "react";
import { BrowserRouter as Router } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";

import Pages from "@/routes";
import { Layout } from "@/components/Layout";
import queryClient from "@/config/queryClient";

import { PredictoryServiceProvider } from "./PredictoryService";
import { SolanaProvider } from "./SolanaProvider";
import { FetchUserComponent } from "@/components/FetchUserComponent";

export const Providers: FC = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <SolanaProvider>
          <PredictoryServiceProvider>
            <Layout>
              <Pages />
              <FetchUserComponent />
            </Layout>
          </PredictoryServiceProvider>
        </SolanaProvider>
      </QueryClientProvider>
    </Router>
  );
};
