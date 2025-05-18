import React from "react";
import MemeSubmit from "./battle/MemeSubmitForm";
import Leaderboard from "../pages/LeaderBoard";
// import MemeBattle from "./battle/MemeBattle";
// import MemeBattleFeed from "./battle/MemeBattleFeed";

const LeaderBoardPag = () => {
  return (
    <div>
      {/* MemeSubmision form */}

      <MemeSubmit />
      {/* ✅ Add Leaderboard Below Trending Memes */}
      <Leaderboard />
    </div>
  );
};

export default LeaderBoardPag;
