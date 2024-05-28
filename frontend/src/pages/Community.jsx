import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { MainLayout, SideBar, MainBar, Box } from "@/components/Layout";

function Community() {
  return (
    <div>
      <Navigation />
      <MainLayout>
        <SideBar>
          <Button variant="sideButton">Create New</Button>
          <Button variant="sideButton">Groups</Button>
          <Button variant="navButton">Folders</Button>
        </SideBar>
        <MainBar>
          <Box>File #1</Box>
          <Box>File #2</Box>
          <Box>File #3</Box>
        </MainBar>
      </MainLayout>
      <h1>Community</h1>
    </div>
  );
}

export default Community;
