import React, { ReactNode } from "react";
import { Username, WalletAddress } from "../../types/shared";
import WardenDetails from "./WardenDetails";

interface TeamBotTileProps {
  name: Username;
  image?: string;
  members: Username[];
  membersHeader: string;
  polygonAddress: WalletAddress;
  ethereumAddress?: WalletAddress;
  buttons: ReactNode;
}

export default function TeamBotTile({
  name,
  image,
  members,
  membersHeader,
  polygonAddress,
  ethereumAddress,
  buttons,
}: TeamBotTileProps) {
  return (
    <section className="account__team type__text--lists">
      <div className="account__team-info">
        <h3>
          <WardenDetails username={name} image={image} avatarSize="40px" />
        </h3>
        <h4>{membersHeader}:</h4>
        <ul>
          {members.map((member) => (
            <li>{member}</li>
          ))}
        </ul>
        {ethereumAddress ||
          (polygonAddress && (
            <>
              <h4>Payment addresses:</h4>
              <ul>
                {polygonAddress && (
                  <li>
                    polygon:{" "}
                    {polygonAddress.slice(0, 5) +
                      "..." +
                      polygonAddress.slice(-4)}
                  </li>
                )}
                {ethereumAddress && (
                  <li>
                    ethereum:{" "}
                    {ethereumAddress.slice(0, 5) +
                      "..." +
                      ethereumAddress.slice(-4)}
                  </li>
                )}
              </ul>
            </>
          ))}
      </div>
      {buttons}
    </section>
  );
}
