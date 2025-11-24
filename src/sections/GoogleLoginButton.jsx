import React, { useEffect } from "react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleLoginButton = ({ onSuccess }) => {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCredentialResponse = (response) => {
    // response.credential is a JWT
    console.log("Google JWT:", response.credential);
    onSuccess(response.credential);
  };

  return <div id="googleSignInDiv"></div>;
};

export default GoogleLoginButton;
