import { useMoralis } from "react-moralis";
import { gql, useQuery, useMutation } from "@apollo/client";
import { signText } from "../../lensApi/ethers.service";
import { setAuthenticationToken } from "../../lensApi/state";
import { useEffect, useContext } from "react";
import LensContext from "../LensContext";

const GET_CHALLENGE = gql`
  query ($request: ChallengeRequest!) {
    challenge(request: $request) {
      text
    }
  }
`;

const AUTHENTICATION = gql`
  mutation ($request: SignedAuthChallenge!) {
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
  }
`;

const Auth = () => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady, setIsLensReady } = useContext(LensContext);
  const {
    loading: challengeLoading,
    error: challengeError,
    data: challengeResponse,
  } = useQuery(GET_CHALLENGE, {
    variables: { request: { address: account } },
  });

  const [_auth, { data: authResult, loading: authLoading, error: authError }] =
    useMutation(AUTHENTICATION);

  const authenticate = async () => {
    const signature = await signText(challengeResponse.challenge?.text);
    _auth({
      variables: { request: { address: account, signature } },
    });
  };

  // this avoids Authenticate and parent component render at the same time
  useEffect(() => {
    if (authResult) {
      setAuthenticationToken(authResult.authenticate.accessToken);
      setIsLensReady(true);
    }
  }, [authResult]);

  challengeError && console.error("challengeError", challengeError);
  authError && console.error(authError);

  return (
    <div className="hud2">
      {account && isAuthenticated ? (
        <button
          disabled={authLoading || isLensReady}
          

          onClick={async () => authenticate()}
        >
          {isLensReady ? "Lens Ready" : "Use Lens"}
        </button>
      ) : (
        <div>2. Connect to Lens</div>
      )}
      {challengeError && <p>Oops! Fail to obtain challenge</p>}
      {authError && <p>Oops! Fail to authenicate LensAPI</p>}
    </div>
  );
};

export default Auth;
