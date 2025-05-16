import React, { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

const TABS = [
  { key: "new", label: "New", api: "https://www.reddit.com/r/memes/new.json?limit=50" },
  { key: "top24", label: "Top (24h)", api: "https://www.reddit.com/r/memes/top.json?limit=50&t=day" },
  { key: "topWeek", label: "Top (Week)", api: "https://www.reddit.com/r/memes/top.json?limit=50&t=week" },
  { key: "topAll", label: "Top (All Time)", api: "https://www.reddit.com/r/memes/top.json?limit=50&t=all" },
];

const ITEMS_PER_PAGE = 12;
const DEFAULT_TAGS = ["funny", "meme", "lol", "humor", "dank", "viral", "fun", "comedy", "jokes", "hilarious"];

function Feed() {
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [tab, setTab] = useState(TABS[1]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState(null);
  const [votes, setVotes] = useState(() => JSON.parse(localStorage.getItem("memeVotes")) || {});
  const [comments, setComments] = useState(() => JSON.parse(localStorage.getItem("memeComments")) || {});
  const [allTags, setAllTags] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedMeme, setSelectedMeme] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchMemes() {
      try {
        const res = await fetch(tab.api);
        const json = await res.json();
        if (json?.data?.children) {
          const posts = json.data.children
            .map(({ data }) => data)
            .filter((post) =>
              (post.post_hint === "image" || post.url.endsWith(".jpg") || post.url.endsWith(".png")) && !post.over_18
            )
            .map((post) => {
              let hashtags = (post.title.match(/#([a-zA-Z0-9-_]+)/g) || []).map(tag => tag.slice(1).toLowerCase());
              if (hashtags.length === 0) {
                hashtags = [...DEFAULT_TAGS].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 1);
              }
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

          const uniqueTags = Array.from(new Set(posts.flatMap((p) => p.hashtags))).sort();
          setAllTags(uniqueTags);
        }
      } catch (error) {
        console.error("Failed to fetch memes:", error);
      }
    }
    fetchMemes();
  }, [tab]);

  useEffect(() => {
    let filtered = memes;

    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(s) || m.hashtags.some((tag) => tag.includes(s))
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

  const handleVote = useCallback((id, vote) => {
    setVotes((prev) => {
      if (prev[id] === vote) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: vote };
    });
  }, []);

  const getDisplayName = (user) => {
    if (user.displayName) return user.displayName;
    if (user.email) {
      const namePart = user.email.split("@")[0];
      const withoutNumbers = namePart.replace(/\d+/g, "");
      const spaced = withoutNumbers.replace(/([a-z])([A-Z])/g, "$1 $2");
      const final = spaced
        .replace(/([a-z]{5,})([a-z]{4,})/, "$1 $2")
        .replace(/([a-z])/, (m) => m.toUpperCase());

      return final
        .split(" ")
        .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
        .join("");
    }
    return "Anonymous";
  };

  const handleAddComment = useCallback((id, text) => {
    if (!text.trim() || !user) return;
    setComments((prev) => {
      const currComments = prev[id] || [];
      return {
        ...prev,
        [id]: [
          ...currComments,
          {
            text: text.trim().slice(0, 140),
            uid: user.uid,
            displayName: getDisplayName(user),
          },
        ],
      };
    });
  }, [user]);

  const handleDeleteComment = useCallback((id, index) => {
    setComments((prev) => {
      const curr = [...(prev[id] || [])];
      curr.splice(index, 1);
      return { ...prev, [id]: curr };
    });
  }, []);

  const onTagClick = (tag) => {
    if (tag === activeTag) setActiveTag(null);
    else {
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
            className={`px-4 py-2 rounded-full font-semibold transition ${tab.key === t.key
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-indigo-100"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 max-w-md mx-auto">
        <input
          type="search"
          placeholder="Search memes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (activeTag) setActiveTag(null);
          }}
          className="flex-grow px-4 py-3 rounded-xl border border-gray-300"
        />
        <select
          value={activeTag || ""}
          onChange={(e) => setActiveTag(e.target.value || null)}
          className="px-4 py-3 rounded-xl border border-gray-300"
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>#{tag}</option>
          ))}
        </select>
        {activeTag && (
          <button
            onClick={() => setActiveTag(null)}
            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
          >
            Clear tag ✕
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
            onDeleteComment={handleDeleteComment}
            onTagClick={onTagClick}
            activeTag={activeTag}
            user={user}
            onImageClick={() => setSelectedMeme(meme)}
          />
        ))}
      </div>

      {page * ITEMS_PER_PAGE < filteredMemes.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-full"
          >
            Load More
          </button>
        </div>
      )}

      {/* Modal Popup */}
      {selectedMeme && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-4 relative max-w-3xl w-full">
            <button
              onClick={() => setSelectedMeme(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
            >
              ✕
            </button>
            <img
              src={selectedMeme.url}
              alt={selectedMeme.title}
              className="w-full rounded-lg object-contain max-h-[80vh] mx-auto"
            />
            <h2 className="text-lg font-bold mt-3 text-center text-indigo-700">{selectedMeme.title}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;

// MemeCard Component
const MemeCard = ({ meme, vote, onVote, comments, onAddComment, onDeleteComment, onTagClick, activeTag, user, onImageClick }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col">
      <img
        src={meme.url}
        alt={meme.title}
        onClick={onImageClick}
        className="w-full object-cover aspect-[4/3] cursor-pointer hover:opacity-80 transition"
      />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-lg text-indigo-700 mb-1">{meme.title}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {meme.hashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`text-xs px-2 py-0.5 rounded-full transition ${activeTag === tag
                ? "bg-indigo-600 text-white"
                : "bg-indigo-100 text-indigo-800 hover:bg-indigo-300"
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Votes */}
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => onVote(meme.id, 1)} className={`p-2 rounded-full ${vote === 1 ? "bg-green-500 text-white" : "bg-gray-200"}`}>👍</button>
          <button onClick={() => onVote(meme.id, -1)} className={`p-2 rounded-full ${vote === -1 ? "bg-red-500 text-white" : "bg-gray-200"}`}>👎</button>
          <span>Votes: {vote}</span>
        </div>

        {/* Comments */}
        <button onClick={() => setShowComments(!showComments)} className="text-indigo-600 font-semibold">
          {showComments ? "Hide" : "Show"} Comments ({comments.length})
        </button>

        {showComments && (
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border p-2 rounded">
            {comments.map((c, i) => (
              <div key={i} className="bg-indigo-50 p-2 rounded text-sm flex justify-between items-center">
                <div>
                  <strong>{c.displayName}:</strong> {c.text}
                </div>
                {user?.uid === c.uid && (
                  <button
                    onClick={() => onDeleteComment(meme.id, i)}
                    className="text-red-600 text-xs ml-3 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}

            {user ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAddComment(meme.id, commentText);
                  setCommentText("");
                }}
              >
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 border rounded"
                />
              </form>
            ) : (
              <p className="text-gray-500 italic">Login to comment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
