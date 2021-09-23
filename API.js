import { HOST } from "./constants";

const getProfile = async (keyId, profileName) => {
  const profileResp = await fetch(
    `${HOST}/auth/fetchProfile?keyId=${keyId}&profileName=${profileName}`
  );
  return await profileResp.json();
};

const renewTokens = (keyId, refreshToken) => {
  try {
    fetch("/auth/renewTokens", {
      method: "POST",
      body: JSON.stringify({
        keyId,
        refreshToken,
      }),
    });
  } catch (err) {
    console.log(err.statusCode);
    console.log(err.message);
  }
};

export { getProfile };
