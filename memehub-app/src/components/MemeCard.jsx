import React from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Eye, MessageSquare } from "lucide-react";
import MemeReactions from "./reactions/MemeReactions";
import MemeReactionsDisplay from "./reactions/ReactionCardDisplay";

const MemeCard = ({ meme, highlight = false }) => {
  return (
    <motion.div
      className={`rounded-2xl shadow-lg bg-white overflow-hidden border hover:shadow-2xl transition-all duration-300 ${
        highlight ? "ring-4 ring-indigo-400 scale-[1.02]" : ""
      }`}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="w-full h-48 bg-white px-4 py-2 flex items-center justify-center overflow-hidden">
        <img
          src={meme.image}
          alt={meme.caption}
          className="object-contain h-full"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{meme.caption}</h3>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Eye size={16} /> {meme.views}
            <ThumbsUp size={16} className="ml-4" /> {meme.upvotes}
            <ThumbsDown size={16} className="ml-2" /> {meme.downvotes}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={16} /> {meme.comments?.length || 0}
          </div>
        </div>

        <MemeReactions memeId={meme.id} />
        <MemeReactionsDisplay memeId={meme.id} />

        <div className="flex gap-2 flex-wrap mt-2">
          {(meme.tags || []).map((tag) => (
            <span
              key={tag}
              className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;
