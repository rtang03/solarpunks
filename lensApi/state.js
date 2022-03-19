let authenticationToken = null;

export let setAuthenticationToken = token => {
  authenticationToken = token;
};

export let getAuthenticationToken = () => {
  return authenticationToken;
};
