import { useState } from 'react'
import ProcessWindowV5 from './ProcessWindowV5'
import FlashGuide from './FlashGuide'

function App() {
  var _s = useState("calc");
  var view = _s[0], setView = _s[1];

  if (view === "guide") {
    return <FlashGuide onClose={function () { setView("calc"); }} />;
  }
  return <ProcessWindowV5 onOpenGuide={function () { setView("guide"); }} />;
}

export default App
