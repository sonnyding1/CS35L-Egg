import { Button } from "@/components/ui/button";

import { MainLayout, SideBar, MainBar } from "@/components/layout";

function Community() {
  return (
    <div>
      <MainLayout>
        <SideBar>
          <Button variant="sideButton">Create New</Button>

        </SideBar>
        <MainBar></MainBar>
      </MainLayout>
    </div>
  );
}

export default Community;
