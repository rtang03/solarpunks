import { useMoralis } from "react-moralis";
import { gql, useQuery, useMutation } from "@apollo/client";
import { signText } from "../../lensApi/ethers.service";
import { setAuthenticationToken } from "../../lensApi/state";
import { useEffect } from "react";

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

const Auth = ({ authenicationCallback }) => {
  const { account } = useMoralis();
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
      return new Promise(resolve =>
        setTimeout(() => {
          authenicationCallback(true);
          resolve();
        }, 200),
      );
    }
  }, [authResult]);

  challengeError && console.error("challengeError", challengeError);
  authError && console.error(authError);

  return (
    <div>
      {account ? (
        <button
          disabled={authLoading || authResult}
          className="bg-blue-500 m-2 p-2 border-2"
          onClick={async () => authenticate()}
        >
          {authResult ? "Authenicated" : "Login to LensAPI"}
        </button>
      ) : (
        <div>Please connect your wallet.</div>
      )}
      {challengeError && <p>Oops! Fail to obtain challenge</p>}
      {authError && <p>Oops! Fail to authenicate LensAPI</p>}
    </div>
  );
};

export default Auth;
