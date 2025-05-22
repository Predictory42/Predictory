import { useMemo, useState, type FC } from "react";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { PaginatedList } from "@/components/PaginatedList";
import useAllEvents from "@/contract/queries/view/all/useAllEvents";
import { MagicLoading } from "@/components/MagicLoading";
import { Button } from "@/shadcn/ui/button";
import { Link } from "react-router";
import { getPredictionStatus, PredictionStatus } from "@/utils/status";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react";
import useParticipants from "@/contract/queries/view/all/useParticipants";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const SORT_BY: Record<PredictionStatus, number> = {
  [PredictionStatus.ACTIVE]: 0,
  [PredictionStatus.WAITING_FOR_RESULT]: 1,
  [PredictionStatus.NOT_STARTED]: 2,
  [PredictionStatus.ENDED]: 3,
  [PredictionStatus.CANCELED]: 4,
  [PredictionStatus.PARTICIPATION_CLOSED]: 5,
};

const StatsCounter: FC = () => {
  const { data: participants } = useParticipants();
  const { data: events } = useAllEvents();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center justify-center p-6 backdrop-blur-sm bg-card/30 rounded-xl border border-border  transition-all duration-300"
      >
        <div className="rounded-full p-3 bg-primary/20 mb-3">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-3xl font-bold">{events?.length || 0}</h3>
        <p className="text-muted-foreground text-sm">Active Markets</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center p-6 backdrop-blur-sm bg-card/30 rounded-xl border border-border  transition-all duration-300"
      >
        <div className="rounded-full p-3 bg-accent/20 mb-3">
          <Users className="w-6 h-6 text-accent" />
        </div>
        <h3 className="text-3xl font-bold">{participants?.length || 0}</h3>
        <p className="text-muted-foreground text-sm">Total Participants</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center p-6 backdrop-blur-sm bg-card/30 rounded-xl border border-border transition-all duration-300"
      >
        <div className="rounded-full p-3 bg-chart-3/20 mb-3">
          <Award className="w-6 h-6 text-chart-3" />
        </div>
        <h3 className="text-3xl font-bold">
          {events?.reduce(
            (acc, event) =>
              acc +
              Number((event.stake.toNumber() / LAMPORTS_PER_SOL).toFixed(2)),
            0,
          ) || 0}
        </h3>
        <p className="text-muted-foreground text-sm">SOL Distributed</p>
      </motion.div>
    </div>
  );
};

export const Home: FC = () => {
  const [participatedPage, setParticipatedPage] = useState(1);
  const itemsPerPage = 6;

  const { data: events, isLoading } = useAllEvents();

  const sortedEvents = useMemo(
    () =>
      events
        ?.map((el) => {
          const currentStatus = getPredictionStatus({
            startDate: el.startDate,
            endDate: el.endDate,
            participationDeadline: el.participationDeadline,
            canceled: el.canceled,
            result: el.result,
          });

          return {
            ...el,
            currentStatus,
          };
        })
        .sort((a, b) => {
          if (a.currentStatus === b.currentStatus) {
            return b.endDate.toNumber() - a.endDate.toNumber();
          }
          return SORT_BY[a.currentStatus] - SORT_BY[b.currentStatus];
        }),
    [events],
  );

  if (isLoading) return <MagicLoading />;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent font-cinzel">
            Predictory: The Future Is Yours to Predict
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            A decentralized prediction market platform built for communities.
            Stake, predict, and earn rewards in a transparent and trustless
            environment.
          </p>

          <Button size="lg" className="group">
            <Link to="/create" className="flex items-center gap-2">
              Create Prediction
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>

        <StatsCounter />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1"
        >
          <h2 className="text-2xl font-bold mb-4 font-cinzel">
            Prediction Markets
          </h2>
        </motion.div>

        {!sortedEvents?.length ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container mx-auto px-4 py-12 gap-2 flex flex-col items-center justify-center backdrop-blur-sm bg-card/20 rounded-xl border border-border"
          >
            <img
              src="/icons/rabbit.svg"
              alt="rabbit"
              className="w-20 h-20 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">No predictions found</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Be the first to create a prediction market
            </p>
            <Button variant="outline" className="group">
              <Link to="/create" className="flex items-center gap-2">
                Create Prediction
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <PaginatedList
              items={sortedEvents}
              itemsPerPage={itemsPerPage}
              currentPage={participatedPage}
              onPageChange={setParticipatedPage}
              renderItem={(event) => (
                <PredictionCard key={event.id.toString()} prediction={event} />
              )}
              className="mb-10"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};
