import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import {
  Box,
  BoxAuthor,
  BoxDate,
  BoxFileName,
  BoxLastComment,
  BoxLike,
  BoxNumLikes,
} from "@/components/ui/box";
import { MainLayout, SideBar, MainBar } from "@/components/Layout";

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
          <Box variant="fileCommunity">
            <BoxFileName filename="Hello.txt"></BoxFileName>
            <BoxAuthor author="Gon Freecs"></BoxAuthor>
            <BoxDate date="01/01/2024"></BoxDate>
            <BoxNumLikes numlikes="17"></BoxNumLikes>
            <BoxLike> Like </BoxLike> {/*Replace with an appropriate immage*/}
            <BoxLastComment lastComment="Hello world!"></BoxLastComment>
          </Box>
          <Box variant="fileCommunity">File #2</Box>
          <Box variant="fileCommunity">File #3</Box>
        </MainBar>
      </MainLayout>
      <h1>Community</h1>
    </div>
  );
}

export default Community;
