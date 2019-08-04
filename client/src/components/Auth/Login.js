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
    <div style={{ backgroundColor: "#47c7c9" }} className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(242, 252, 252)" }}
      >
        Bienvenido!
      </Typography>
      <Typography
        component="h1"
        variant="h6"
        gutterBottom
        noWrap
        style={{ color: "rgb(242, 252, 252)" }}
      >
        Crea tus puntos, agregales imagenes y descripción!
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
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
