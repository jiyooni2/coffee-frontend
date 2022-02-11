import { useForm } from "react-hook-form";
import { faJava } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Home from "./screens/Home";
import ThemeToggle from "./screens/ThemeToggle";
import SignUp from "./screens/SignUp";
import Add from "./screens/Add";
import Edit from "./screens/Edit";
import NotFound from "./screens/NotFound";
import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar, darkModeVar } from "./apollo";
import { ThemeProvider } from "styled-components";
import { darkTheme, GlobalStyles, lightTheme } from "./styles";
import routes from "./routes";
import { HelmetProvider } from "react-helmet-async";
import { client } from "./apollo";
import { ApolloProvider } from "@apollo/client";
import styled from "styled-components";
import { logUserOut } from "./apollo";
import { Link } from "react-router-dom";

const Header = styled.div`
  height: 15vh;
  padding: 20px 20px;
  display: flex;
  margin-bottom: 20px;
  a {
    color: ${(props) => props.theme.fontColor};
  }
`;

const NavBar = styled.div`
  margin-left: auto;
  display: flex;
  font-size: 19px;
  justify-content: center;
  align-items: center;
  a,
  span {
    color: ${(props) => props.theme.fontColor};

    cursor: pointer;
    margin-right: 20px;
  }
`;

function App() {
  //fro testing
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <ApolloProvider client={client}>
      <HelmetProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            <Header>
              <Link to={routes.home}>
                <FontAwesomeIcon icon={faJava} size="5x" />
              </Link>
              <NavBar>
                {isLoggedIn ? (
                  <>
                    <span onClick={logUserOut}>Logout</span>
                    <Link to={routes.createShop}>Add CoffeeShop</Link>
                    <Link to={routes.editShop}>Edit CoffeeShop</Link>
                  </>
                ) : (
                  <>
                    <Link to={routes.login}>Log-in</Link>
                    <Link to={routes.signUp}>Sign-up</Link>
                  </>
                )}
                <ThemeToggle />
              </NavBar>
            </Header>

            <Routes>
              {/* 매치되는 것 하나만 보내줌 */}
              <Route path={routes.home} element={<Home />} />
              <Route
                path={routes.login}
                element={<>{isLoggedIn ? <Home /> : <Login />}</>}
              />
              <Route
                path={routes.signUp}
                element={!isLoggedIn ? <SignUp /> : <Home />}
              />
              <Route path={routes.createShop} element={<Add />} />
              <Route path={routes.editShop} element={<Edit />} />
              {/* 모두 매치 안되면 여기에서 매칭 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;
