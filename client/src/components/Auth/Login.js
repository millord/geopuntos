import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ME_QUERY } from "../../graphql/queries";

import Context from "../../context";
import { BASE_URL } from "../../client";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: {
          authorization: idToken
        }
      });
      const { me } = await client.request(ME_QUERY);
      console.log({ me });

      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "IS_LOGGED_IN", payload: googleUser.isSignedIn() });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = err => {
    console.error("Error logging", err);
    dispatch({ type: "IS_LOGGED_IN", payload: false });
  };

  return (
    <div style={{ backgroundColor: "#14a10d" }} className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(50, 119, 168)" }}
      >
        Bienvenido!
      </Typography>
      <Typography
        className={classes.rootMobile}
        component="h1"
        variant="h6"
        gutterBottom
        noWrap
        style={{ color: "rgb(50, 119, 168)" }}
      >
        Crea puntos y agregale fotos!
      </Typography>
      <GoogleLogin
        isSignedIn={true}
        onSuccess={onSuccess}
        onFailure={onFailure}
        buttonText="Entra con Google"
        theme="dark"
        clientId="576111148542-b2krr34gg28p8dtheu8etj4votfk317i.apps.googleusercontent.com"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(to right, #78ffd6, #a8ff78)"
  },
  rootMobile: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "stretch"
  }
};

export default withStyles(styles)(Login);
