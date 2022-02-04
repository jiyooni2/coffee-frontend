import styled from "styled-components";
import { darkModeVar } from "../apollo";

const Container = styled.div``;

const Button = styled.button`
  background-color: ${(props) => props.theme.bgColor};
`;

function ThemeToggle() {
  return (
    <Container>
      <Button
        onClick={() => {
          const old = darkModeVar();
          darkModeVar(!old);
        }}
      >
        {darkModeVar() ? "OFF" : "ON"}
      </Button>
    </Container>
  );
}

export default ThemeToggle;
