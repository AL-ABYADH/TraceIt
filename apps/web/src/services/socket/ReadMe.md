## `socket/` Directory

This folder contains the WebSocket (e.g., Socket.io) client setup and related logic for real-time features in the application.

### Structure
- `client.ts`: Initializes and exports the Socket.io client instance.
- `events.ts`: Defines event names and types for socket communication.
        `Read the example inside client.ts for better understanding`

### Best Practices & Design Patterns
1. **Singleton ish... Pattern for Client**
	 - Export a single socket client instance from `client.ts` to avoid multiple connections.

2. **Centralized Event Definitions**
	 - Keep all event names/types in `events.ts` for consistency and type safety.
	 - Example:
     
		 ```ts
		 // events.ts
		 export const SOCKET_EVENTS = {
			 CONNECT: 'connect',
			 DISCONNECT: 'disconnect',
			 MESSAGE: 'message',
		 };

		 ```

3. **Custom Hooks for React Integration**
	 - Create hooks (e.g., `use-socket-event`) to subscribe/unsubscribe to events in React components.
     - preferable put the file in the Hooks folder
	 - Example:
		 ```ts
		 // use-socket-event.ts
		 import { useEffect } from 'react';
		 import socket from './client';
		 export function useSocketEvent(event, handler) {
			 useEffect(() => {
				 socket.on(event, handler);
				 return () => { socket.off(event, handler); };
			 }, [event, handler]);
		 }
		 ```
    -Create once run anywhere <3 and benefit from the SOC between layers and freely add any logic between the socket listener to run every time anywhere 


### Usage
Import the socket client or hooks into your modules or components as needed:

```ts
import { SOCKET_EVENTS } from '@/services/socket/events';
import { useSocketEvent } from '@/hooks/use-socket-event' 
// snake-case is preferred as the naming convention all over the project
// be carful about the files naming (specially css files)
// On deployment, differences in letter casing can cause build failures on Linux (but not on Windows).
```

This approach keeps your real-time logic modular, testable (one point of failure), and easy to maintain :).
