import { useMemo, useState, type FC } from "react";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { PaginatedList } from "@/components/PaginatedList";

import useAllEvents from "@/contract/queries/view/all/useAllEvents";
import { MagicLoading } from "@/components/MagicLoading";
import { Button } from "@/shadcn/ui/button";
import { Link } from "react-router";
import { getPredictionStatus, PredictionStatus } from "@/utils/status";

const SORT_BY: Record<PredictionStatus, number> = {
  [PredictionStatus.ACTIVE]: 0,
  [PredictionStatus.NOT_STARTED]: 1,
  [PredictionStatus.ENDED]: 2,
  [PredictionStatus.CANCELED]: 3,
  [PredictionStatus.PARTICIPATION_CLOSED]: 4,
};

export const Home: FC = () => {
  const [participatedPage, setParticipatedPage] = useState(1);
  const itemsPerPage = 6;

  const { data: events, isLoading } = useAllEvents();

  const sorterEvents = useMemo(
    () =>
      events
        ?.map((el) => {
          const currentStatus = getPredictionStatus({
            startDate: el.startDate,
            endDate: el.endDate,
            participationDeadline: el.participationDeadline,
            canceled: el.canceled,
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
  if (!sorterEvents?.length)
    return (
      <div className="container mx-auto px-4 py-8 gap-2 flex flex-col items-center justify-center">
        <img
          src="/icons/rabbit.svg"
          alt="rabbit"
          className="w-16 h-16 mx-auto"
        />
        <h2 className="text-2xl font-bold">No predictions found</h2>
        <p className="text-sm text-muted-foreground">
          Be the first to create a prediction
        </p>
        <Button variant="outline" className="mt-4">
          <Link to="/create">Create Prediction</Link>
        </Button>
      </div>
    );

  return (
    <div>
      <PaginatedList
        items={sorterEvents}
        itemsPerPage={itemsPerPage}
        currentPage={participatedPage}
        onPageChange={setParticipatedPage}
        renderItem={(event) => (
          <PredictionCard key={event.id.toString()} prediction={event} />
        )}
      />
    </div>
  );
};
