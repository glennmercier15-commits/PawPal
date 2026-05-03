export async function requestNotificationPermissions() {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

const REMINDER_MESSAGES = [
  { title: "🐰 Sprinkles misses you!",    body: "Come feed and play with your pet 💖"           },
  { title: "⭐ Your pet's happiness dropped!", body: "Give them some love and attention 🥰"      },
  { title: "🍓 Feeding time!",             body: "Your pet's tummy is growling 🍽️"              },
  { title: "🛁 Bath time!",                body: "Your pet needs a wash to stay clean & happy!" },
  { title: "💤 Your pet is tired...",      body: "Put them to bed for the night 🌙"             },
  { title: "🎾 Play time!",               body: "Your pet wants to fetch the ball with you!"    },
];

export async function scheduleAllPetReminders() {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  // In a real mobile app (like React Native with Expo), we would schedule background push notifications here.
  // Since we are in a web environment, we'll try to set timeouts for the current active session.
  
  const scheduleDaily = (targetHour: number, targetMinute: number, messageIndex: number) => {
    const now = new Date();
    const target = new Date();
    target.setHours(targetHour, targetMinute, 0, 0);

    if (now.getTime() > target.getTime()) {
      target.setDate(target.getDate() + 1); // target next day
    }

    const timeToWait = target.getTime() - now.getTime();
    
    setTimeout(() => {
      sendLocalNotification(
        REMINDER_MESSAGES[messageIndex].title, 
        REMINDER_MESSAGES[messageIndex].body
      );
      // reschedule for next day
      setInterval(() => {
        sendLocalNotification(
          REMINDER_MESSAGES[messageIndex].title, 
          REMINDER_MESSAGES[messageIndex].body
        );
      }, 24 * 60 * 60 * 1000);
    }, timeToWait);
  };

  // Morning reminder — 9:00 AM daily
  scheduleDaily(9, 0, 0);

  // Afternoon reminder — 3:00 PM daily
  scheduleDaily(15, 0, 3);

  // Evening reminder — 7:30 PM daily
  scheduleDaily(19, 30, 4);
}

export function sendLocalNotification(title: string, body: string) {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' });
  }
}

// Call this when a specific stat goes critically low (< 20)
export async function sendLowStatAlert(statName: 'hunger' | 'happiness' | 'energy' | 'cleanliness', petName: string) {
  const messages = {
    hunger:      { title: `🍓 ${petName} is starving!`,     body: 'Feed your pet right now!' },
    happiness:   { title: `😢 ${petName} is very sad!`,     body: 'Play with your pet to cheer them up!' },
    energy:      { title: `💤 ${petName} is exhausted!`,    body: 'Put your pet to sleep!' },
    cleanliness: { title: `🛁 ${petName} needs a bath!`,    body: 'Give your pet a wash!' },
  };

  const msg = messages[statName];
  if (!msg) return;

  sendLocalNotification(msg.title, msg.body);
}
