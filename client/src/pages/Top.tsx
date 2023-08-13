import React, { useEffect } from 'react';
import { MakingRoom } from "../components/MakingRoom";

export const Top = () => {
  useEffect(() => {
    document.title = 'Simple Chat';
  }, []);

  return (
    <>
      <h1>Simple Chat</h1>
      <MakingRoom />
    </>
  );
};
