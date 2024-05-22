# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# Implementation of layout.jsx

*In Apple-event-announcer's voice: Today, I'm excited to announce layout.jsx. layout.jsx has four brand new div-like classes: MainLayout, SideBar, MainBar and Box. To start with, let's use an example:
'''
<MainLayout>
    <SideBar>
        ...
    </SideBar>
    <MainBar>
        <Box>... </Box>
        <Box>... </Box>
        <Box>... </Box>
    </MainBar>
<MainLayout>


MainLayout: amends the SideBar and MainBar.
SideBar: Holds necessary buttons that stays transfixed on the page.
MainBar: Scrollable contents that can be subdivided into further rows, displaying documents and their info.
Box: Each box represent one document and the information will be adjusted depending on the page.

Each comes with styles and adjustments and totally doesn't have untested bugs to fix (as far as I know). If any questions, contact gonfreecs17 in the Discord. 


