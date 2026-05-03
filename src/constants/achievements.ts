export const ACHIEVEMENTS = [
  { id: 'first_feed',   label: '🍓 First Meal',      desc: 'Feed your pet for the first time',  condition: (s: any) => s.totalFeeds >= 1    },
  { id: 'day_3',        label: '📅 3-Day Streak',     desc: 'Open the app 3 days in a row',       condition: (s: any) => s.streak >= 3        },
  { id: 'day_7',        label: '🔥 Week Warrior',     desc: '7-day login streak',                 condition: (s: any) => s.streak >= 7        },
  { id: 'level_5',      label: '⭐ Level 5',          desc: 'Reach pet level 5',                  condition: (s: any) => s.level >= 5         },
  { id: 'shop_first',   label: '🛍️ First Purchase',   desc: 'Buy your first accessory',           condition: (s: any) => s.totalPurchases >= 1},
  { id: 'game_10',      label: '🎮 Gamer Girl',       desc: 'Play 10 mini-games',                 condition: (s: any) => s.gamesPlayed >= 10  },
  { id: 'diary_5',      label: '📓 Dear Diary',       desc: 'Create 5 diary entries',             condition: (s: any) => s.diaryEntries >= 5  },
  { id: 'all_stats_100',label: '💯 Perfect Pet',      desc: 'All stats at 100 at the same time',  condition: (s: any) => s.hadPerfectStats     },
];
