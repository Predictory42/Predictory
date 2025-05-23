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
  XCircle,
  TrendingUp,
  Sparkles,
  Globe,
  Clock,
  Lock,
  ArrowRight,
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
import { personImage, truncateAddress } from "@/utils";
import { MagicLoading } from "@/components/MagicLoading";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { AllEvents } from "@/types/predictory";
import useParticipants from "@/contract/queries/view/all/useParticipants";
import useWithdrawStake from "@/contract/queries/action/useWithdrawStake";
import { ActionButton } from "@/components/prediction/PredictionActions";
import { motion } from "framer-motion";

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

  const { data: participants } = useParticipants();

  // Find events created by this user
  const createdEvents =
    allEvents?.filter((event) => event.authority.toBase58() === address) || [];

  const participatedEvents: AllEvents[] =
    allEvents?.filter((event) =>
      participants?.some(
        (participant) =>
          participant.payer.toBase58() === address &&
          participant.eventId.toString() === event.id.toString(),
      ),
    ) || [];

  const trustLevel = user?.trustLvl.toNumber() ?? 0;
  //TODO: Mock statistics, implement
  const mockAppeals = 2;
  const mockSuccessRate = 92;

  const mockRecord = {
    won: participatedEvents.filter(
      (event) =>
        event.result ===
        participants?.find((p) => p.eventId.toString() === event.id.toString())
          ?.option,
    ).length,
    lost: participatedEvents.filter(
      (event) =>
        event.result !==
        participants?.find((p) => p.eventId.toString() === event.id.toString())
          ?.option,
    ).length,
    pending: participatedEvents.filter(
      (event) =>
        (event.result === -1 || event.result === null) &&
        event.endDate.toNumber() < Date.now() / 1000,
    ).length,
    canceled: participatedEvents.filter((event) => event.canceled).length,
  };

  const { mutateAsync: withdrawStake, isPending: isWithdrawing } =
    useWithdrawStake();

  const handleWithdrawStake = async () => {
    await withdrawStake();
  };

  if (isLoadingUser || isLoadingAllEvents) return <MagicLoading />;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Predictions
          </Link>
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="backdrop-blur-sm bg-card/30 overflow-hidden rounded-xl border border-border">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-sm opacity-30"></div>
                    <img
                      src={personImage(address || "")}
                      alt="Avatar"
                      className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-primary rounded-full relative z-10"
                    />
                    <div className="absolute -bottom-1 -right-1 z-20 bg-background rounded-full p-1 border border-primary">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  <div>
                    <CardTitle className="text-3xl font-bold flex items-center gap-2 font-cinzel">
                      {userName ? userName : truncateAddress(address || "")}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {isCurrentUser ? "You" : "Oracle"}
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
                  <Button variant="outline" size="sm" asChild>
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 flex items-center gap-1.5 text-amber-500 border-amber-500"
                >
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="text-sm font-medium">
                    {creatorRating.toFixed(1)} Oracle Rating
                  </span>
                </Badge>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 flex items-center gap-1.5 border-primary"
                  >
                    <HeartHandshake className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {trustLevel} Mana
                    </span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-primary" />
                    Oracle Influence
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-lg border border-border bg-background/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          Appeals Filed
                        </span>
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <p className="text-2xl font-bold">{mockAppeals}</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-lg border border-border bg-background/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          Success Rate
                        </span>
                        <Award className="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold">{mockSuccessRate}%</p>
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-accent" />
                    Market Activity
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-lg border border-border bg-background/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          Created
                        </span>
                        <FileCheck className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold">
                        {createdEvents.length}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-lg border border-border bg-background/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">
                          Participated
                        </span>
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                      </div>
                      <p className="text-2xl font-bold">
                        {participatedEvents.length}
                      </p>
                    </motion.div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-chart-3" />
                    Mystical Achievements
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500 gap-1.5 py-1.5">
                      <Medal className="h-3.5 w-3.5 fill-amber-500" />
                      Prophecy Master
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 gap-1.5 py-1.5">
                      <Award className="h-3.5 w-3.5 fill-blue-500" />
                      Trusted Oracle
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="backdrop-blur-sm bg-card/30 overflow-hidden rounded-xl border border-border h-full">
            <CardHeader>
              <CardTitle className="font-cinzel flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Divination Stats
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2.5 w-2.5 p-0 bg-green-500 border-green-500 rounded-full"
                        ></Badge>
                        Prophecies Fulfilled
                      </span>
                      <span className="text-sm font-medium text-green-500">
                        {mockRecord.won}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2.5 w-2.5 p-0 bg-red-500 border-red-500 rounded-full"
                        ></Badge>
                        Incorrect Visions
                      </span>
                      <span className="text-sm font-medium text-red-500">
                        {mockRecord.lost}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2.5 w-2.5 p-0 bg-amber-500 border-amber-500 rounded-full"
                        ></Badge>
                        Unresolved Omens
                      </span>
                      <span className="text-sm font-medium text-amber-500">
                        {mockRecord.pending}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Badge
                          variant="outline"
                          className="h-2.5 w-2.5 p-0 bg-gray-500 border-gray-500 rounded-full"
                        ></Badge>
                        Dispelled Forecasts
                      </span>
                      <span className="text-sm font-medium">
                        {mockRecord.canceled}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-lg border border-border bg-background/50 backdrop-blur-sm flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Stake balance
                    </span>
                    <span className="text-sm font-bold">
                      {(user?.stake.toNumber() ?? 0) / LAMPORTS_PER_SOL} SOL
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-amber-500" />
                      Locked
                    </span>
                    <span className="text-sm font-bold">
                      {(user?.lockedStake.toNumber() ?? 0) / LAMPORTS_PER_SOL}{" "}
                      SOL
                    </span>
                  </div>
                  {isCurrentUser && (
                    <ActionButton
                      onClick={handleWithdrawStake}
                      isLoading={isWithdrawing}
                      variant="destructive"
                      className="mt-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Withdraw Stake
                    </ActionButton>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-8"
      >
        <Tabs defaultValue="created">
          <TabsList className="w-full grid grid-cols-2 lg:w-fit mb-6">
            <TabsTrigger value="created">Created Predictions</TabsTrigger>
            <TabsTrigger value="participated">
              Participated Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="mt-0">
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
              <Card className="backdrop-blur-sm bg-card/30 p-8 text-center rounded-xl border border-border">
                <img
                  src="/icons/rabbit.svg"
                  alt="rabbit"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <p className="text-muted-foreground mb-4">
                  You haven't created any predictions yet
                </p>
                <Button variant="outline" className="group">
                  <Link to="/create" className="flex items-center gap-2">
                    Create Your First Prediction
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="participated" className="mt-0">
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
              <Card className="backdrop-blur-sm bg-card/30 p-8 text-center rounded-xl border border-border">
                <img
                  src="/icons/rabbit.svg"
                  alt="rabbit"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <p className="text-muted-foreground mb-4">
                  You haven't participated in any predictions yet
                </p>
                <Button variant="outline" className="group">
                  <Link to="/" className="flex items-center gap-2">
                    Explore Predictions
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};
