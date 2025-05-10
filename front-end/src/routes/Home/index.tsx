import { useState, type FC } from "react";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { PaginatedList } from "@/components/PaginatedList";

import useAllEvents from "@/contract/queries/view/all/useAllEvents";
import { MagicLoading } from "@/components/MagicLoading";
import { Button } from "@/shadcn/ui/button";
import { Link } from "react-router";

export const Home: FC = () => {
  const [participatedPage, setParticipatedPage] = useState(1);
  const itemsPerPage = 6;

  const { data: events, isLoading } = useAllEvents();

  if (isLoading) return <MagicLoading />;
  if (!events)
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
        items={events}
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
