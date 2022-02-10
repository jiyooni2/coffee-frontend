import { isLoggedInVar, logUserOut } from "./../apollo";
import { gql, useMutation, useQuery } from "@apollo/client";
import { BaseBox } from "./../components/shared";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../routes";
import { Link } from "react-router-dom";

const SEE_COFFEE_SHOPS_MUTATION = gql`
  query seeCoffeeShops($page: Int!) {
    seeCoffeeShops(page: $page) {
      id
      name
      latitude
      longitude
      user {
        username
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

interface IShop {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  user: { name: string };
  photos: { url: string };
  categories: { name: string };
}

const Container = styled.div`
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

function Home() {
  const location: any = useLocation();

  const page = 1;
  const { data, loading } = useQuery(SEE_COFFEE_SHOPS_MUTATION, {
    variables: {
      page,
    },
  });

  console.log(data);

  return (
    <div>
      <button onClick={logUserOut}>Logout</button>

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
              <Link to={`/shop/${shop.id}`}>Edit</Link>
            </HomeBox>
          ))}
        </Container>
      )}
    </div>
  );
}

export default Home;
