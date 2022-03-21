import { connectors } from "./config";
import { useMoralis } from "react-moralis";
import Image from "next/image";
import { useState } from "react";
import DialogModal from "../DialogModal";
import { shortenAddress } from "../../lib/shortenAddress";
import { getExplorer } from "../../lib/networks";
import Address from "../Address";

const Account = () => {
  const { authenticate, chainId, isAuthenticated, isAuthenticating, logout, authError, account } =
    useMoralis();
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const closeWalletDialogModal = () => setIsWalletDialogOpen(false);
  const openWalletDialogModal = () => setIsWalletDialogOpen(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const closeAuthDialogModal = () => setIsAuthDialogOpen(false);
  const openAuthDialogModal = () => setIsAuthDialogOpen(true);

  if (!isAuthenticated || !account)
    return (
      <>
        <button type="button" onClick={openWalletDialogModal} class="hud1">
          1. Connect wallet
        </button>

        <DialogModal
          isOpen={isWalletDialogOpen}
          handleClose={closeWalletDialogModal}
          title="Connect Wallet"
        >
          <div>
            {/* Using MetaMask */}
            <div className="text-center">
              {connectors.map(({ title, icon, connectorId }, key) => (
                <button
                  className="m-2 h-28 w-96 cursor-pointer rounded-md border-2 p-2 text-center hover:border-blue-500"
                  key={key}
                  disabled={isAuthenticating}
                  onClick={async () => {
                    try {
                      await authenticate({ provider: connectorId });
                      window.localStorage.setItem("connectorId", connectorId);
                      setIsWalletDialogOpen(false);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <Image src={icon} alt={title} height={50} width={50} />
                  <p>{title}</p>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={closeWalletDialogModal}
              >
                Close
              </button>
              {/* TODO: enhance me */}
              {authError && authError.message}
            </div>
          </div>
        </DialogModal>
      </>
    );

  const explorerURL = chainId && getExplorer(chainId);
  return (
    <>
      <button type="button" onClick={openAuthDialogModal} class="hud1">
        {shortenAddress(account)}
      </button>
      <DialogModal isOpen={isAuthDialogOpen} handleClose={closeAuthDialogModal} title="Account">
        <>
          <div className="m-2 rounded border-2">
            <Address copyable={true} shortAddress={true} chars={5} />
            {explorerURL && (
              <a
                className="m-2 p-2 underline"
                target="_blank"
                rel="noreferrer"
                href={`${explorerURL}/address/${account}`}
              >
                View on Explorer
              </a>
            )}
          </div>

          <button
            className="border-2 p-2 m-2"
            onClick={async () => {
              await logout();
              window.localStorage.removeItem("connectorId");
              setIsAuthDialogOpen(false);
            }}
          >
            Disconnect Wallet
          </button>

          {/* Close Button */}
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={closeAuthDialogModal}
            >
              Close
            </button>
          </div>
        </>
      </DialogModal>
    </>
  );
};

export default Account;
