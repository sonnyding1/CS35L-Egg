import { Button } from "@/components/ui/button";

import { MainLayout, SideBar, MainBar } from "@/components/layout";

function Community() {
  return (
    <div>
      <MainLayout>
        <SideBar>
          <Button variant="sideButton">Create New</Button>
          <Button variant="sideButton">Groups</Button>
          <Button variant="navButton">Folders</Button>
        </SideBar>
        <MainBar></MainBar>
      </MainLayout>
      <h1>Community</h1>
    </div>
  );
}

export default Community;
