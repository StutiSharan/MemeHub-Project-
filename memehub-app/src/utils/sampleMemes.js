const memeImages = [
  "https://i.ytimg.com/vi/UP-yOO41OFc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDerF1KWU3mUpRkW2RLAUC1KQB9yQ",
  "https://www.shutterstock.com/image-vector/programmers-copying-pasting-code-instead-600nw-2252985323.jpg",
  "https://i.pinimg.com/736x/d5/be/57/d5be57f2dd5064d460c0fa48249c3263.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoF9NIVU6DFG4a9FLYdh20wlLo-nBLu2x38A&s",
  "https://plaky.com/blog/wp-content/uploads/2023/08/It-was-me.jpg",
  "https://plaky.com/blog/wp-content/uploads/2023/08/Intro.jpg",
  "https://blog.zegocloud.com/wp-content/uploads/2024/02/programming-meme-27.jpg",
  "https://i.chzbgr.com/thumb800/22357253/h39C226B3/memes-game-developer-github-java-c-computer-memes-software-developer-funny-funny-memes-memes-geek",
  "https://plaky.com/blog/wp-content/uploads/2023/08/Meetings-suck.jpg://i.imgur.com/ZP1gFbZ.jpeg",
  "https://i.imgur.https://plaky.com/blog/wp-content/uploads/2023/08/Programmer-baby.jpg/UH3IPXz.jpeg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzEMeqqymEOwQMmTs0C4n0_S06M15Jq7U13Q&s",
  "https://i.pinimg.com/736x/4f/82/8d/4f828d05f82b8b7aedfe8be6a7d9d2a3.jpg", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFSWtTxOSnBcqvWHYK5UujV4gJQ2vR9WDVSw&s",
];

const memes = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  image: memeImages[i % memeImages.length],
  caption: `Funny Meme ${i + 1}`,
  author: `User${(i % 5) + 1}`,
  upvotes: Math.floor(Math.random() * 200),
  downvotes: Math.floor(Math.random() * 50),
  views: Math.floor(Math.random() * 10000),
  comments: [],
  tags: ['funny', 'meme', 'relatable']
}));

export default memes;
