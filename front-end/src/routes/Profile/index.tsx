import { type FC, useState } from "react";
import { Link, useParams } from "react-router";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/shadcn/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  Award,
  AlertCircle,
  FileCheck,
  Flame,
  Star,
  Medal,
  HeartHandshake,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import useAllEvents from "@/contract/queries/view/all/useAllEvents";
import useUser from "@/contract/queries/view/id/useUser";
import { bufferToString } from "@/contract/utils";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { PaginatedList } from "@/components/PaginatedList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { Separator } from "@/shadcn/ui/separator";
import { Badge } from "@/shadcn/ui/badge";
import { cn } from "@/shadcn/utils";
import { personImage, truncateAddress } from "@/utils";
import { MagicLoading } from "@/components/MagicLoading";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { AllEvents } from "@/types/predictory";

//TODO: Mock creator rating function, implement
function getCreatorRating(address: string): number {
  const hash = Array.from(address).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return 3 + (hash % 200) / 100; // Rating between 3.0 and 5.0
}

export const Profile: FC = () => {
  const { address } = useParams();
  const { publicKey, disconnect } = useWallet();
  const { data: allEvents, isLoading: isLoadingAllEvents } = useAllEvents();
  const { data: user, isLoading: isLoadingUser } = useUser(address ?? "");

  const userName = user?.name ? bufferToString(user.name) : "Predictor";
  const isCurrentUser = publicKey?.toString() === address;
  const creatorRating = getCreatorRating(address || "");

  const [createdPage, setCreatedPage] = useState(1);
  const [participatedPage, setParticipatedPage] = useState(1);
  const itemsPerPage = 6;

  // Find events created by this user
  const createdEvents =
    allEvents?.filter((event) => event.authority.toBase58() === address) || [];

  //TODO: Mock participated events, implement
  const participatedEvents: AllEvents[] = [];

  const trustLevel = user?.trustLvl.toNumber() ?? 0;
  //TODO: Mock statistics, implement
  const mockAppeals = 2;
  const mockSuccessRate = 92;

  //TODO: Mock record data, implement
  const mockRecord = {
    won: Math.floor(Math.random() * 10) + 5,
    lost: Math.floor(Math.random() * 5) + 1,
    pending: Math.floor(Math.random() * 3) + 1,
    canceled: Math.floor(Math.random() * 2),
    solEarned: (Math.random() * 10).toFixed(2),
  };

  if (isLoadingUser || isLoadingAllEvents) return <MagicLoading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-8" asChild>
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Predictions
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card
            className={cn("bg-popover/30 backdrop-blur-sm overflow-hidden")}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={personImage(address || "")}
                      alt="Avatar"
                      className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-primary rounded-full"
                    />
                  </div>

                  <div>
                    <CardTitle className="text-3xl font-bold flex items-center gap-2">
                      {userName ? userName : truncateAddress(address || "")}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {isCurrentUser ? "You" : "User"}
                      </Badge>
                    </CardTitle>
                    {userName && (
                      <CardDescription className="mt-1">
                        {truncateAddress(address || "")}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="link" size="sm" asChild>
                    <a
                      href={`https://solscan.io/account/${address}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Solscan
                    </a>
                  </Button>
                  {isCurrentUser && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => disconnect()}
                    >
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="outline"
                  className="px-2.5 py-1 flex items-center gap-1 text-amber-500 border-amber-500"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span className="text-sm font-medium">
                    {creatorRating.toFixed(1)} Rating
                  </span>
                </Badge>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="px-2.5 py-1 flex items-center gap-1 border-primary"
                  >
                    <HeartHandshake className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium">
                      {trustLevel} Trust Level
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2">Trust Profile</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-md border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Appeals Filed
                        </span>
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                      </div>
                      <p className="text-xl font-bold">{mockAppeals}</p>
                    </div>
                    <div className="p-3 rounded-md border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Success Rate
                        </span>
                        <Award className="h-3 w-3 text-green-500" />
                      </div>
                      <p className="text-xl font-bold">{mockSuccessRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2">Activity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-md border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Created
                        </span>
                        <FileCheck className="h-3 w-3 text-blue-500" />
                      </div>
                      <p className="text-xl font-bold">
                        {createdEvents.length}
                      </p>
                    </div>
                    <div className="p-3 rounded-md border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Participated
                        </span>
                        <Flame className="h-3 w-3 text-orange-500" />
                      </div>
                      <p className="text-xl font-bold">
                        {participatedEvents.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-popover/30 backdrop-blur-sm overflow-hidden h-full">
            <CardHeader>
              <CardTitle>Prediction Stats</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Outcome Distribution
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2 w-2 p-0 bg-green-500 border-green-500"
                        ></Badge>
                        Won
                      </span>
                      <span className="text-sm font-medium text-green-500">
                        {mockRecord.won}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2 w-2 p-0 bg-red-500 border-red-500"
                        ></Badge>
                        Lost
                      </span>
                      <span className="text-sm font-medium text-red-500">
                        {mockRecord.lost}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2 w-2 p-0 bg-amber-500 border-amber-500"
                        ></Badge>
                        Pending
                      </span>
                      <span className="text-sm font-medium text-amber-500">
                        {mockRecord.pending}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2 w-2 p-0 bg-gray-500 border-gray-500"
                        ></Badge>
                        Canceled
                      </span>
                      <span className="text-sm font-medium">
                        {mockRecord.canceled}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-md border border-border bg-background/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Locked SOL</span>
                    <span className="text-sm font-bold">
                      {(user?.lockedStake.toNumber() ?? 0) / LAMPORTS_PER_SOL}{" "}
                      SOL
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Achievements</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500 gap-1 py-1">
                      <Medal className="h-3 w-3 fill-amber-500" />
                      Top Predictor
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 gap-1 py-1">
                      <Award className="h-3 w-3 fill-blue-500" />
                      Trusted User
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="created">
          <TabsList className="w-full grid grid-cols-2 lg:w-fit">
            <TabsTrigger value="created">Created Predictions</TabsTrigger>
            <TabsTrigger value="participated">
              Participated Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="mt-6">
            {createdEvents.length > 0 ? (
              <PaginatedList
                items={createdEvents}
                itemsPerPage={itemsPerPage}
                currentPage={createdPage}
                onPageChange={setCreatedPage}
                renderItem={(event) => (
                  <PredictionCard
                    key={event.id.toString()}
                    prediction={event}
                  />
                )}
              />
            ) : (
              <Card className="bg-muted/30 p-8 text-center">
                <p className="text-muted-foreground">
                  No created predictions found
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="participated" className="mt-6">
            {participatedEvents.length > 0 ? (
              <PaginatedList
                items={participatedEvents}
                itemsPerPage={itemsPerPage}
                currentPage={participatedPage}
                onPageChange={setParticipatedPage}
                renderItem={(event) => (
                  <PredictionCard
                    key={event.id.toString()}
                    prediction={event}
                  />
                )}
              />
            ) : (
              <Card className="bg-muted/30 p-8 text-center">
                <p className="text-muted-foreground">
                  No participated predictions found
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
