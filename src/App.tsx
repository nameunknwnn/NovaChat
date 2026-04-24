import Header from "./components/header"
import Sidebar from "./components/sidebar"

function App() {
  return (
   <div>
    <div className="flex justify-center ">
      <div className="w-1/4"><Sidebar /></div>
      <div className="w-3/4"><Header /></div>
    </div>
   </div>
  )
}

export default App
