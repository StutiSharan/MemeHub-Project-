import React from 'react'

const trendingTags = ['funny', 'cringe', 'weekend', 'relatable', 'darkhumor', 'pets', 'work', 'studentlife']

const TagList = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {trendingTags.map(tag => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs hover:bg-yellow-200 transition"
        >
          #{tag}
        </button>
      ))}
    </div>
  )
}

export default TagList
