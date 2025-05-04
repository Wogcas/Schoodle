import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';


export function App() {
  const linking = {
    prefixes: ['/'],
    config: {

    },
  };

  return <ExpoRoot linking={linking} />;
}

registerRootComponent(App);
