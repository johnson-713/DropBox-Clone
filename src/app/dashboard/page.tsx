import DropZoneComponent from "@/components/DropZone"
import { auth } from "@clerk/nextjs"


function Dashboard() {
  const {userId} = auth()
  return (
    <div>
      <DropZoneComponent />
    </div>
  )
}

export default Dashboard
