import { LazyMotionConfig } from "./components/layout/MotionConfig";
import ScrollProgress from "./components/layout/ScrollProgress";
import Opening from "./chapters/Opening";
import ThreeFriends from "./chapters/ThreeFriends";
import CountDifferently from "./chapters/CountDifferently";
import FairnessCriteria from "./chapters/FairnessCriteria";
import ImpossibleAsk from "./chapters/ImpossibleAsk";
import ProofSketch from "./chapters/ProofSketch";
import TradeOffs from "./chapters/TradeOffs";
import Footer from "./chapters/Footer";

export default function App() {
  return (
    <LazyMotionConfig>
      <ScrollProgress />
      <main>
        <Opening />
        <ThreeFriends />
        <CountDifferently />
        <FairnessCriteria />
        <ImpossibleAsk />
        <ProofSketch />
        <TradeOffs />
        <Footer />
      </main>
    </LazyMotionConfig>
  );
}
