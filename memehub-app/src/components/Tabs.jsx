import React from 'react'

const Tabs = ({ selected, onChange }) => {
  const tabs = [
    { label: 'New', value: 'new' },
    { label: 'Top (24h)', value: 'top24' },
    { label: 'Top (Week)', value: 'topWeek' },
    { label: 'Top (All Time)', value: 'topAll' }
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selected === tab.value
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tabs
