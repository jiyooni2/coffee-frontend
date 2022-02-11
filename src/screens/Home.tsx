import { isLoggedInVar, logUserOut } from "./../apollo";
import { gql, useMutation, useQuery } from "@apollo/client";
import { BaseBox } from "./../components/shared";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../routes";
import { Link } from "react-router-dom";
import { isJSDocUnknownTag } from "typescript";
import jwtDecode from "jwt-decode";

const SEE_COFFEE_SHOPS_MUTATION = gql`
  query seeCoffeeShops($page: Int!) {
    seeCoffeeShops(page: $page) {
      id
      name
      latitude
      longitude
      user {
        username
        id
      }
      photos {
        url
      }
      categories {
        name
      }
    }
  }
`;

const Container = styled.div`
  padding: 20px 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const HomeBox = styled(BaseBox)`
  display: flex;
  max-width: 300px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 35px 40px 25px 40px;
  margin-bottom: 10px;
  margin-right: 10px;
`;

interface LocationState {
  state: string;
}

interface IDecoded {
  id: string;
}

function Home() {
  const location: any = useLocation();

  const page = 1;
  const { data, loading } = useQuery(SEE_COFFEE_SHOPS_MUTATION, {
    variables: {
      page,
    },
  });

  let id = "";
  const token = localStorage.getItem("token");
  if (token) {
    const decoded: IDecoded = jwtDecode(token);
    id = decoded.id;
  }

  return (
    <div>
      {location?.state?.message}

      {loading ? (
        "loading..."
      ) : (
        <Container>
          {data?.seeCoffeeShops.map((shop: any) => (
            <HomeBox key={shop.id}>
              <span>name: {shop.name}</span>
              <span>latitude: {shop.latitude}</span>
              <span>longitude: {shop.longitude}</span>
              <span>user: {shop.user?.username}</span>
              <span>photo: {shop.photos[0]?.url}</span>
              {shop.user?.id == id ? (
                <Link to={`/shop/${shop.id}`}>Edit</Link>
              ) : null}
            </HomeBox>
          ))}
        </Container>
      )}
    </div>
  );
}

export default Home;
