import Header from "./components/header"
import Sidebar from "./components/sidebar"

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header />
      </div>
    </div>
  )
}

export default App
