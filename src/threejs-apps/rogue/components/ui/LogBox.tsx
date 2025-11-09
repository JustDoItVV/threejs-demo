'use client';

import { selectLogMessages, useRogueStore } from '../../store/rogue-store';

export function LogBox() {
  const logMessages = useRogueStore(selectLogMessages);
  const messages = logMessages.slice(-10); // Show last 10 messages

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 pointer-events-auto">
      <div className="bg-black/80 text-white p-3 rounded-lg border border-white/20 min-w-[300px] max-w-[400px]">
        <div className="text-xs font-bold text-gray-400 mb-2">Combat Log</div>
        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className="text-xs text-gray-300 font-mono">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
