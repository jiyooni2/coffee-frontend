import styled from "styled-components";
import { isLoggedInVar } from "./../apollo";

const Title = styled.h1`
  color: ${(props) => props.theme.fontColor};
`;

const Container = styled.div``;

function Login() {
  return (
    <Container>
      <Title>Login</Title>
      <button onClick={() => isLoggedInVar(true)}>Login</button>
    </Container>
  );
}

export default Login;
