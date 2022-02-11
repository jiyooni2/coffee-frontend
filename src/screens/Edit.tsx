import { faJava } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import routes from "../routes";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import Separator from "../components/auth/Separator";
import Input from "../components/auth/Input";
import FormBox from "../components/auth/FormBox";
import BottomBox from "../components/auth/BottomBox";
import { FatLink } from "../components/shared";
import PageTitle from "../components/pageTitle";
import { gql, useMutation, useQuery } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { useNavigate, useParams } from "react-router-dom";

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Subtitle = styled(FatLink)`
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
`;

type FormValues = {
  name: string;
  latitude: string;
  longitude: string;
  category: string;
  url: string;
  result: string;
};

const EDIT_COFFEE_SHOP_MUTATION = gql`
  mutation editCoffeeShop(
    $id: Int!
    $name: String
    $latitude: String
    $longitude: String
    $category: String
    $url: String
  ) {
    editCoffeeShop(
      id: $id
      name: $name
      latitude: $latitude
      longitude: $longitude
      category: $category
      url: $url
    ) {
      ok
      error
    }
  }
`;

const SEE_COFFEE_SHOP_QUERY = gql`
  query seeCoffeeShop($id: Int!) {
    seeCoffeeShop(id: $id) {
      id
      name
      latitude
      longitude
      categories {
        name
      }
      photos {
        url
      }
    }
  }
`;

interface IData {
  editCoffeeShop: {
    ok: boolean;
    error?: string;
  };
}

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading: queryLoading } = useQuery(SEE_COFFEE_SHOP_QUERY, {
    onError: () => {
      navigate(routes.home, {
        state: { message: "Invalid shop Id" },
      });
    },
    variables: {
      id: Number(id),
    },
  });

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const onCompleted = (data: IData) => {
    const {
      editCoffeeShop: { ok, error },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }

    navigate(routes.home, {
      state: { message: "Edit completed." },
    });
  };

  const [editCoffeeShop, { loading }] = useMutation(EDIT_COFFEE_SHOP_MUTATION, {
    onCompleted,
    context: {
      headers: {
        token: localStorage.getItem("token"),
      },
    },
  });

  const onSubmitValid: SubmitHandler<FormValues> = (data) => {
    if (loading) {
      return;
    }
    const { name, latitude, longitude, category, url } = getValues();
    editCoffeeShop({
      variables: { id: Number(id), name, latitude, longitude, category, url },
    });
  };

  const clearAddError = () => {
    return clearErrors("result");
  };

  return (
    <AuthLayout>
      <PageTitle title="Edit CoffeeShop" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faJava} size="3x" />
          <Subtitle>Add coffee shop.</Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("name", { required: "Name is required" })}
            onFocus={clearAddError}
            defaultValue={data?.seeCoffeeShop?.name}
            type="text"
            placeholder="Name"
            hasError={Boolean(formState.errors?.name)}
          />
          <FormError message={formState.errors?.name?.message} />
          <Input
            {...register("latitude", { required: "latitude is required." })}
            onFocus={clearAddError}
            defaultValue={data?.seeCoffeeShop?.latitude}
            type="text"
            placeholder="latitude"
            hasError={Boolean(formState.errors?.latitude)}
          />
          <FormError message={formState.errors?.latitude?.message} />
          <Input
            {...register("longitude", { required: "longitude is required." })}
            onFocus={clearAddError}
            defaultValue={data?.seeCoffeeShop?.longitude}
            type="text"
            placeholder="longitude"
            hasError={Boolean(formState.errors?.longitude)}
          />
          <FormError message={formState.errors?.longitude?.message} />
          <Input
            {...register("category", {
              required: "category is required.",
            })}
            onFocus={clearAddError}
            type="text"
            placeholder="category separated by comma"
            hasError={Boolean(formState.errors?.category)}
          />
          <FormError message={formState.errors?.category?.message} />
          <Input
            {...register("url", { required: "photo is required" })}
            onFocus={clearAddError}
            defaultValue={data?.seeCoffeeShop[0]?.url}
            type="text"
            placeholder="url"
            hasError={Boolean(formState.errors?.url)}
          />
          <FormError message={formState.errors?.url?.message} />
          <Button
            type="submit"
            value={loading ? "Loading..." : "Add CoffeeShop"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={formState.errors?.result?.message} />
        </form>
      </FormBox>
    </AuthLayout>
  );
}

export default Edit;
