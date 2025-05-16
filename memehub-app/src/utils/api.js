// utils/api.js

// Generate 20 fake memes
export const getMemes = () => {
  const tags = ['funny', 'cringe', 'relatable', 'darkhumor', 'studentlife']

  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    image: `https://source.unsplash.com/random/800x600?sig=${i + 1}`,
    caption: `Meme caption ${i + 1}`,
    views: Math.floor(Math.random() * 10000),
    upvotes: Math.floor(Math.random() * 500),
    downvotes: Math.floor(Math.random() * 100),
    comments: Array.from({ length: Math.floor(Math.random() * 10) }, (_, j) => `Comment ${j + 1}`),
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
    createdAt: Date.now() - Math.floor(Math.random() * 100000000)
  }))
}

// Get meme of the day (highest net votes in last 24h)
export const getMemeOfTheDay = (memes) => {
  const dayAgo = Date.now() - 86400000
  return memes
    .filter(m => m.createdAt > dayAgo)
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))[0] || memes[0]
}

// Weekly leaderboard (top creators by net votes)
export const getLeaderboard = () => {
  return [
    { username: 'memequeen99', score: 1245, badge: '10k Views Club' },
    { username: 'darklord_memes', score: 980, badge: 'Weekly Winner' },
    { username: 'laugh_maniac', score: 875, badge: 'First Viral Post' }
  ]
}
