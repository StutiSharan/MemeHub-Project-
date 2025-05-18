import React, { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { getDatabase, ref, get, onValue } from "firebase/database";

const TABS = [
  {
    key: "top24",
    label: "Top (24h)",
    api: "https://www.reddit.com/r/memes/top.json?limit=50&t=day",
  },
  { key: "new", label: "New", api: null },
  {
    key: "topWeek",
    label: "Top (Week)",
    api: "https://www.reddit.com/r/memes/top.json?limit=50&t=week",
  },
  {
    key: "topAll",
    label: "Top (All Time)",
    api: "https://www.reddit.com/r/memes/top.json?limit=50&t=all",
  },
];

const ITEMS_PER_PAGE = 12;
const DEFAULT_TAGS = [
  "funny",
  "meme",
  "lol",
  "humor",
  "dank",
  "viral",
  "fun",
  "comedy",
  "jokes",
  "hilarious",
];

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto dismiss after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-indigo-600 text-white px-6 py-3 rounded shadow-lg animate-fadeInOut z-50">
      {message}
    </div>
  );
};
function Feed() {
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [tab, setTab] = useState(TABS[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTag, setActiveTag] = useState(null);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [votes, setVotes] = useState(
    () => JSON.parse(localStorage.getItem("memeVotes")) || {}
  );
  const [comments, setComments] = useState(
    () => JSON.parse(localStorage.getItem("memeComments")) || {}
  );
  const [allTags, setAllTags] = useState([]);
  const [user, setUser] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const [reactions, setReactions] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const reactionRef = ref(db, "reactions");

    // ✅ Fetch reactions from Firebase in real-time
    onValue(reactionRef, (snapshot) => {
      setReactions(snapshot.val() || {}); // Ensure data exists
    });
  }, []);
  // Function to show toast messages
  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const openMemeModal = (meme) => {
    setSelectedMeme(meme);
  };

  const closeMemeModal = () => {
    setSelectedMeme(null);
  };

  // Share meme image using Web Share API or fallback copy link
  const shareMeme = async () => {
    if (!selectedMeme) return;

    try {
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const response = await fetch(selectedMeme.url);
        const blob = await response.blob();

        const fileExtension = selectedMeme.url
          .split(".")
          .pop()
          .split(/\#|\?/)[0];
        const fileName = `${selectedMeme.id || "meme"}.${fileExtension}`;
        const file = new File([blob], fileName, { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: selectedMeme.title,
            text: "Check out this meme!",
          });
          showToast("Meme shared successfully!");
        } else {
          showToast("Sharing files is not supported on this device.");
        }
      } else {
        if (navigator.share) {
          await navigator.share({
            title: selectedMeme.title,
            text: "Check out this meme!",
            url: selectedMeme.url,
          });
          showToast("Meme shared successfully!");
        } else {
          await navigator.clipboard.writeText(selectedMeme.url);
          showToast("Meme URL copied to clipboard!");
        }
      }
    } catch (error) {
      showToast("Sharing failed or was cancelled.");
      console.error(error);
    }
  };

  // Track logged-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchMemes() {
      try {
        let redditMemes = [];

        if (tab.key !== "new" && tab.api) {
          const res = await fetch(tab.api);
          const json = await res.json();

          if (json?.data?.children) {
            redditMemes = json.data.children
              .map(({ data }) => data)
              .filter(
                (post) =>
                  (post.post_hint === "image" ||
                    post.url.endsWith(".jpg") ||
                    post.url.endsWith(".png")) &&
                  !post.over_18
              )
              .map((post) => {
                let hashtags = (
                  post.title.match(/#([a-zA-Z0-9-_]+)/g) || []
                ).map((tag) => tag.slice(1).toLowerCase());
                if (hashtags.length === 0) {
                  hashtags = [...DEFAULT_TAGS]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, Math.floor(Math.random() * 2) + 1);
                }
                return {
                  id: post.id,
                  title: post.title,
                  url: post.url,
                  author: post.author,
                  ups: post.ups,
                  created_utc: post.created_utc * 1000,
                  hashtags,
                  source: "reddit",
                };
              });
          }
        }

        let firebaseMemes = [];
        if (tab.key === "new") {
          const db = getDatabase();
          const snapshot = await get(ref(db, "publicMemes"));
          if (snapshot.exists()) {
            const data = snapshot.val();
            firebaseMemes = Object.entries(data).map(([id, post]) => {
              let author = "anonymous";
              if (typeof post.author === "string") {
                author = post.author;
              } else if (typeof post.author === "object" && post.author.email) {
                author = post.author.email.split("@")[0];
              }

              return {
                id,
                title: post.title,
                url: post.imageBase64 || post.image,
                author,
                ups: post.ups || 0,
                created_utc: post.timestamp || Date.now(),
                hashtags: post.tags || ["funny"],
                source: "firebase",
              };
            });
          }
        }

        const combined = [...redditMemes, ...firebaseMemes].sort(
          (a, b) => b.created_utc - a.created_utc
        );

        setMemes(combined);
        setFilteredMemes(combined);
        setPage(1);
        setActiveTag(null);
        setSearch("");

        const uniqueTags = Array.from(
          new Set(combined.flatMap((p) => p.hashtags))
        ).sort();
        setAllTags(uniqueTags);
      } catch (error) {
        console.error("Failed to fetch memes:", error);
      }
    }

    fetchMemes();
  }, [tab, user]); // added user because we use user.displayName in firebase memes

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

  // reactions shape: { memeId: { emoji: count } }
  const getReactionsForMeme = (memeId) => reactions[memeId] || {};

  const handleReact = (memeId, emoji) => {
    setReactions((prev) => {
      const memeReactions = prev[memeId] || {};
      const currentCount = memeReactions[emoji] || 0;
      return {
        ...prev,
        [memeId]: {
          ...memeReactions,
          [emoji]: currentCount + 1,
        },
      };
    });
  };

  // votes shape: { memeId: { userId: 1 or -1 } }
  // Calculate total vote count for a meme
  const getTotalVotes = (memeId) => {
    if (!votes[memeId]) return 0;
    return Object.values(votes[memeId]).reduce((sum, v) => sum + v, 0);
  };

  // Get current user's vote on a meme (0 if none)
  const getUserVote = (memeId) => {
    if (!user) return 0;
    return votes[memeId]?.[user.uid] || 0;
  };

  const handleVote = useCallback(
    (memeId, voteValue) => {
      if (!user) return; // only logged-in users can vote

      setVotes((prev) => {
        const memeVotes = prev[memeId] || {};
        const currentUserVote = memeVotes[user.uid] || 0;

        let updatedMemeVotes = { ...memeVotes };

        if (currentUserVote === voteValue) {
          // If user clicks the same vote, remove vote (toggle off)
          delete updatedMemeVotes[user.uid];
        } else {
          // Otherwise, set the new vote
          updatedMemeVotes[user.uid] = voteValue;
        }

        return {
          ...prev,
          [memeId]: updatedMemeVotes,
        };
      });
    },
    [user]
  );

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

  const handleAddComment = useCallback(
    (id, text) => {
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
    },
    [user]
  );

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
    <div className="space-y-10 px-4 sm:px-6 lg:px-16 py-6 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 min-h-screen text-white select-none">
      {" "}
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
          className="px-4 py-3 rounded-xl border border-gray-300 bg-indigo-500 text-white"
        >
          <option value="" className="text-white">
            All Tags
          </option>
          {allTags.map((tag) => (
            <option key={tag} value={tag} className="text-white">
              #{tag}
            </option>
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
            totalVotes={getTotalVotes(meme.id)}
            userVote={getUserVote(meme.id)}
            onVote={handleVote}
            comments={comments[meme.id] || []}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            onTagClick={onTagClick}
            activeTag={activeTag}
            user={user}
            onClickImage={() => openMemeModal(meme)}
            reactions={getReactionsForMeme(meme.id) || {}}
            onReact={handleReact} // Pass click handler here
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
      {selectedMeme && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeMemeModal} // Close when clicking outside the box
        >
          <div
            className="relative bg-white rounded-lg p-4 max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal on clicking inside
          >
            {/* Close Button */}
            <button
              onClick={closeMemeModal}
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-3xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* Meme Image */}
            <img
              src={selectedMeme.url}
              alt={selectedMeme.title}
              className="w-full max-h-[80vh] object-contain rounded"
              loading="lazy"
            />

            {/* Share Button */}
            <button
              onClick={shareMeme}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Share Meme
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;

// MemeCard Component
const MemeCard = ({
  meme,
  totalVotes,
  userVote,
  onVote,
  comments,
  onReact,
  onAddComment,
  onDeleteComment,
  onTagClick,
  onClickImage,
  activeTag,
  reactions,
  user,
}) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col">
      <img
        src={meme.url}
        alt={meme.title}
        className="w-full object-cover aspect-[4/3] cursor-pointer" // add cursor-pointer for UX
        loading="lazy"
        onClick={onClickImage} // add this!
      />
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="font-bold text-lg text-indigo-700">{meme.title}</h3>
          {meme.source === "firebase" &&
            Date.now() - meme.created_utc < 24 * 60 * 60 * 1000 && (
              <span className="text-xs bg-yellow-300 text-black px-2 py-0.5 rounded-full animate-pulse ml-2">
                New
              </span>
            )}
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Posted by{" "}
          <span className="font-medium text-indigo-700">@{meme.author}</span>
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {meme.hashtags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`text-xs px-2 py-0.5 rounded-full transition ${
                activeTag === tag
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
          <button
            onClick={() => onVote(meme.id, 1)}
            disabled={!user}
            className={`p-2 rounded-full transition ${
              userVote === 1 ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            title={user ? "Upvote" : "Login to vote"}
          >
            👍
          </button>
          <button
            onClick={() => onVote(meme.id, -1)}
            disabled={!user}
            className={`p-2 rounded-full transition ${
              userVote === -1 ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
            title={user ? "Downvote" : "Login to vote"}
          >
            👎
          </button>
          <span className="font-semibold">Total Votes: {totalVotes}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {["😂", "❤️", "😮", "🔥"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(meme.id, emoji)}
              className="flex items-center gap-1 text-xl sm:text-l cursor-pointer select-none"
              title={`React with ${emoji}`}
              type="button"
            >
              <span>{emoji}</span>
              <span className="text-indigo-700 font-semibold select-none min-w-[18px] text-center">
                {reactions[emoji] > 0 ? reactions[emoji] : ""}
              </span>
            </button>
          ))}
        </div>
        {/* Comments */}
        <button
          onClick={() => setShowComments((show) => !show)}
          className="mb-3 text-indigo-700 hover:underline self-start"
        >
          {showComments ? "Hide Comments" : `Comments (${comments.length})`}
        </button>

        {showComments && (
          <div className="flex flex-col gap-2">
            {comments.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-100 rounded p-2"
              >
                <div>
                  <span className="font-semibold">
                    {c.displayName || "Anon"}
                  </span>
                  : <span>{c.text}</span>
                </div>
                {user && user.uid === c.uid && (
                  <button
                    onClick={() => onDeleteComment(meme.id, i)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    title="Delete comment"
                  >
                    &times;
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
                className="flex gap-2 mt-2"
              >
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-40 sm:flex-grow px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && commentText.trim()) {
                        onAddComment(meme.id, commentText.trim());
                        setCommentText("");
                      }
                    }}
                    disabled={!user}
                  />
                  <button
                    onClick={() => {
                      if (commentText.trim()) {
                        onAddComment(meme.id, commentText.trim());
                        setCommentText("");
                      }
                    }}
                    disabled={!user || !commentText.trim()}
                    className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
                  >
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-500">Login to comment</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
