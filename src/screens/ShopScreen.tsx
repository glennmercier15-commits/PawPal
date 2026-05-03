import React, { useState } from 'react';
import { usePetStore } from '../store/usePetStore';
import { CoinCounter } from '../components/CoinCounter';
import { motion } from 'motion/react';
import { SHOP_ITEMS } from '../constants/shop';

export const ShopScreen: React.FC = () => {
  const { coins, spendCoins, ownedItems, addOwnedItem, equippedItems, equipItem, unequipItem } = usePetStore();
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'accessory', 'outfit', 'toy', 'furniture'];

  const filtered = filter === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(i => i.category === filter);

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (coins < item.price) {
      alert(`You need ${item.price - coins} more Paw Coins!`);
      return;
    }
    const confirmed = window.confirm(`Buy ${item.emoji} ${item.name} for ${item.price} Paw Coins?`);
    if (confirmed) {
      spendCoins(item.price);
      addOwnedItem(item.id);
    }
  };

  const handleEquip = (item: typeof SHOP_ITEMS[0]) => {
    if (equippedItems[item.category] === item.id) {
      unequipItem(item.category);
    } else {
      equipItem(item.id, item.category);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col pt-12 px-6 safe-top bg-pal-background overflow-y-auto pb-32">
      <div className="flex justify-between items-center w-full mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-pal-text">Shop</h1>
          <p className="text-pal-text/70 font-medium">Buy treats & toys!</p>
        </div>
        <CoinCounter />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-pal-primary text-white shadow-sm'
                : 'bg-pal-card text-pal-text/60 border border-pal-primary/10'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((item, index) => {
          const isOwned = ownedItems.includes(item.id);
          const canAfford = coins >= item.price;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => !isOwned && handleBuy(item)}
              className={`bg-pal-card p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border flex flex-col items-center text-center cursor-pointer relative overflow-hidden transition-all ${
                isOwned ? 'border-pal-success' : 'border-pal-primary/10'
              }`}
            >
              <div className="text-5xl mb-2 mt-2">{item.emoji}</div>
              <p className="font-extrabold text-pal-text text-sm leading-tight mb-1">{item.name}</p>
              <p className="text-[10px] font-bold text-pal-text/40 uppercase tracking-widest mb-3">{item.category}</p>
              
              <div className="mt-auto w-full">
                {isOwned ? (
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEquip(item); }}
                    className={`w-full py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      equippedItems[item.category] === item.id 
                        ? 'bg-pal-primary text-white' 
                        : 'bg-pal-success/10 text-pal-success active:bg-pal-success/20'
                    }`}
                  >
                    {equippedItems[item.category] === item.id ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <div className={`py-1.5 rounded-xl font-bold text-sm ${
                    canAfford ? 'bg-pal-gold/20 text-pal-gold' : 'bg-pal-background text-pal-text/40'
                  }`}>
                    {item.price} \u20A1
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
