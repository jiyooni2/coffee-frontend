import styled from "styled-components";
import { darkModeVar } from "../apollo";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Container = styled.div``;

const Button = styled.button`
  background-color: ${(props) => props.theme.bgColor};
`;

function ThemeToggle() {
  return (
    <Container>
      <div
        onClick={() => {
          const old = darkModeVar();
          darkModeVar(!old);
        }}
      >
        {darkModeVar() ? (
          <FontAwesomeIcon icon={faToggleOn} size="1x" />
        ) : (
          <FontAwesomeIcon icon={faToggleOff} size="1x" />
        )}
      </div>
    </Container>
  );
}

export default ThemeToggle;
