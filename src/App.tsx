import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import ThemeToggle from "./screens/ThemeToggle";

import NotFound from "./screens/NotFound";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar, darkModeVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";

function App() {
  //fro testing
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <ThemeToggle />
      <Router>
        <Routes>
          {/* 매치되는 것 하나만 보내줌 */}
          <Route path="/" element={<>{isLoggedIn ? <Home /> : <Login />}</>} />
          {/* 모두 매치 안되면 여기에서 매칭 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
