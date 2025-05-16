import React, { useEffect, useState, useCallback } from "react";

const TABS = [
  { key: "new", label: "New", api: "https://www.reddit.com/r/memes/new.json?limit=50" },
  { key: "top24", label: "Top (24h)", api: "https://www.reddit.com/r/memes/top.json?limit=50&t=day" },
  { key: "topWeek", label: "Top (Week)", api: "https://www.reddit.com/r/memes/top.json?limit=50&t=week" },
  { key: "topAll", label: "Top (All Time)", api: "https://www.reddit.com/r/memes/top.json?limit=50&t=all" },
];

const ITEMS_PER_PAGE = 12;

function Feed() {
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [tab, setTab] = useState(TABS[1]); // default to Top (24h)
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState(null);

  const [votes, setVotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("memeVotes")) || {};
    } catch {
      return {};
    }
  });
  const [comments, setComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("memeComments")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    async function fetchMemes() {
      try {
        const res = await fetch(tab.api);
        const json = await res.json();
        if (json?.data?.children) {
          const posts = json.data.children
            .map(({ data }) => data)
            .filter(
              (post) =>
                (post.post_hint === "image" || post.url.endsWith(".jpg") || post.url.endsWith(".png") || post.url.endsWith(".jpeg")) &&
                !post.over_18
            )
            .map((post) => {
              const hashtags = (post.title.match(/#([a-zA-Z0-9-_]+)/g) || []).map(tag => tag.slice(1).toLowerCase());

              return {
                id: post.id,
                title: post.title,
                url: post.url,
                author: post.author,
                ups: post.ups,
                created_utc: post.created_utc,
                hashtags,
              };
            });
          setMemes(posts);
          setFilteredMemes(posts);
          setPage(1);
          setActiveTag(null);
          setSearch("");
        }
      } catch (error) {
        console.error("Failed to fetch memes:", error);
      }
    }
    fetchMemes();
  }, [tab]);

  // Filter by search and active tag
  useEffect(() => {
    let filtered = memes;

    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(s) ||
          m.hashtags.some((tag) => tag.includes(s))
      );
    }

    if (activeTag) {
      filtered = filtered.filter((m) => m.hashtags.includes(activeTag));
    }

    setFilteredMemes(filtered);
    setPage(1);
  }, [search, activeTag, memes]);

  useEffect(() => {
    localStorage.setItem("memeVotes", JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem("memeComments", JSON.stringify(comments));
  }, [comments]);

  const handleVote = useCallback(
    (id, vote) => {
      setVotes((prev) => {
        if (prev[id] === vote) {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        }
        return { ...prev, [id]: vote };
      });
    },
    [setVotes]
  );

  const handleAddComment = useCallback(
    (id, text) => {
      if (!text.trim()) return;
      setComments((prev) => {
        const currComments = prev[id] || [];
        return {
          ...prev,
          [id]: [...currComments, text.trim().slice(0, 140)],
        };
      });
    },
    [setComments]
  );

  const loadMore = () => setPage((p) => p + 1);

  // Click tag sets filter
  const onTagClick = (tag) => {
    if (tag === activeTag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
      setSearch("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              tab.key === t.key
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search & Clear Tag Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 max-w-md mx-auto">
        <input
          type="search"
          placeholder="Search memes by title or hashtag..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (activeTag) setActiveTag(null);
          }}
          className="flex-grow px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        {activeTag && (
          <button
            onClick={() => setActiveTag(null)}
            className="text-indigo-600 hover:underline font-semibold"
          >
            Clear tag filter: #{activeTag}
          </button>
        )}
      </div>

      {/* Meme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {filteredMemes.slice(0, page * ITEMS_PER_PAGE).map((meme) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            vote={votes[meme.id] || 0}
            onVote={handleVote}
            comments={comments[meme.id] || []}
            onAddComment={handleAddComment}
            onTagClick={onTagClick}
            activeTag={activeTag}
          />
        ))}
      </div>

      {/* Load More */}
      {page * ITEMS_PER_PAGE < filteredMemes.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 shadow-lg transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Feed;

// MemeCard component (images NOT clickable, tags clickable)
const MemeCard = ({ meme, vote, onVote, comments, onAddComment, onTagClick, activeTag }) => {
  const [commentText, setCommentText] = React.useState("");
  const [showComments, setShowComments] = React.useState(false);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition relative flex flex-col">
      <img
        src={meme.url}
        alt={meme.title}
        className="w-full object-cover aspect-[4/3]"
        loading="lazy"
      />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-indigo-700 mb-1">{meme.title}</h3>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {meme.hashtags.length === 0 && (
            <span className="text-xs text-gray-400 italic">No tags</span>
          )}
          {meme.hashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`text-xs rounded-full px-2 py-0.5 cursor-pointer select-none transition ${
                activeTag === tag
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-800 hover:bg-indigo-300"
              }`}
              title={`Filter by #${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Votes */}
        <div className="flex items-center gap-3 mb-3 select-none">
          <button
            onClick={() => onVote(meme.id, 1)}
            className={`p-2 rounded-full transition ${
              vote === 1
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 hover:bg-green-100"
            }`}
            aria-label="Upvote"
            title="Upvote"
          >
            👍
          </button>
          <button
            onClick={() => onVote(meme.id, -1)}
            className={`p-2 rounded-full transition ${
              vote === -1
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-200 hover:bg-red-100"
            }`}
            aria-label="Downvote"
            title="Downvote"
          >
            👎
          </button>
          <span className="text-gray-700 font-semibold">
            Votes: {vote === 1 ? "1" : vote === -1 ? "-1" : "0"}
          </span>
        </div>

        {/* Comment Toggle */}
        <button
          onClick={() => setShowComments((v) => !v)}
          className="mb-2 text-indigo-600 font-semibold hover:underline self-start"
          aria-expanded={showComments}
          aria-controls={`comments-${meme.id}`}
        >
          {showComments ? "Hide Comments" : `Show Comments (${comments.length})`}
        </button>

        {/* Comments Section */}
        {showComments && (
          <div
            id={`comments-${meme.id}`}
            className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-indigo-200 p-2 rounded"
          >
            {comments.length === 0 && (
              <p className="text-sm text-gray-400 italic select-none">No comments yet.</p>
            )}
            {comments.map((c, i) => (
              <div
                key={i}
                className="bg-indigo-50 text-indigo-900 px-3 py-1 rounded text-sm break-words"
              >
                {c}
              </div>
            ))}

            {/* Add Comment Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (commentText.trim().length === 0) return;
                onAddComment(meme.id, commentText.trim().slice(0, 140));
                setCommentText("");
              }}
              className="mt-2"
            >
              <input
                type="text"
                maxLength={140}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment (max 140 chars)"
                className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
