/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { AppNavigator } from './navigation/AppNavigator';
import { scheduleAllPetReminders } from './utils/notifications';

export default function App() {
  useEffect(() => {
    scheduleAllPetReminders();
  }, []);

  return <AppNavigator />;
}
