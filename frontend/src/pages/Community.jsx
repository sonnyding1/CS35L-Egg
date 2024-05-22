import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {MainLayout, SideBar, MainBar, Box} from "@/components/layout"

function Community() {
  return (
    <div>
      <Navigation />
      <MainLayout>
        <SideBar>
          <Button variant="navButton">
            Create New
          </Button>
          <Button variant="navButton">
            Groups
          </Button>
          <Button variant="navButton">
            Folders
          </Button>
  
        </SideBar>
        <MainBar>
          <Box>
            File #1
          </Box>
          <Box>
            File #2
          </Box>
          <Box>
            File #3
          </Box>
        </MainBar>
      </MainLayout>
      <h1>Community</h1>
    </div>
  );
}

export default Community;
