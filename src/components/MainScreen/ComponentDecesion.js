import React from "react";
import { useLocation } from "react-router-dom";
import Journey from "../tabs/Journey";
import Saved from "../tabs/Saved";
import PlayGround from "../tabs/PlayGround";
import Universities from "../tabs/Universities";
import Settings from "../settings/Settings";
import Dashboard from "../tabs/Dashboard";

export default function ComponentDecesion() {
  const location = useLocation();
  return (
    <>
      {location?.pathname === "/journey" ? (
        <>
          <Journey
            heading="Select All Roles and Activities that Apply"
            para="When a rising senior is applying to colleges or universities,
                demonstrating a solid record of scholarship is essential. Here's
                a list of participations and accomplishments that can help
                bolster their application"
            title="Title"
          />
        </>
      ) : location?.pathname === "/saved" ? (
        <>
          <Saved
            heading="Select All Roles and Activities that Apply"
            para="When a rising senior is applying to colleges or universities,
                demonstrating a solid record of scholarship is essential. Here's
                a list of participations and accomplishments that can help
                bolster their application"
            title="Title"
          />
        </>
      ) : location?.pathname === "/playground" ? (
        <PlayGround
          heading="Select All Roles and Activities that Apply"
          para="When a rising senior is applying to colleges or universities,
                demonstrating a solid record of scholarship is essential. Here's
                a list of participations and accomplishments that can help
                bolster their application"
          title="Title"
        />
      ) : location?.pathname === "/universities" ? (
        <Universities
          heading="Select All Roles and Activities that Apply"
          para="When a rising senior is applying to colleges or universities,
              demonstrating a solid record of scholarship is essential. Here's
              a list of participations and accomplishments that can help
              bolster their application"
          title="Title"
        />
      ) : location?.pathname === "/settings" ? (
        <Settings
          heading="Select All Roles and Activities that Apply"
          para="When a rising senior is applying to colleges or universities,
            demonstrating a solid record of scholarship is essential. Here's
            a list of participations and accomplishments that can help
            bolster their application"
          title="Title"
        />
      ) : location?.pathname === "/dashboard" ? (
        <Dashboard />
      ) : (
        ""
      )}
    </>
  );
}
