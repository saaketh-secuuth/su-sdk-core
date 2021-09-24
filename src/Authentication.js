import { HOST } from "./constants";
import { generateKeys, timer } from "./Utilities";

export default class SecAuthentication {
  constructor(keyId, profileName) {
    this.profileName = profileName;
    this.keyId = keyId;
  }

  async getTokens(initAuthResp, authCode, profile, codeVerifier) {
    const { signInMode } = profile;

    let bodyData = {
      userId: initAuthResp.userId,
      keyId: this.keyId,
      authCode: authCode,
      signInMode: signInMode || 0,
      additionalInfo: "AdditionalInfo",
      codeVerifier: codeVerifier,
    };
    let resp = null;
    resp = await fetch(`${HOST}/auth/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    return resp.json();
  }

  async verifyAuth({ userId, challengeId, challenge }) {
    const bodyData = {
      userId,
      challengeId,
      challenge,
    };
    console.log("bodyData", bodyData);
    let resp = null;
    let verifyResp = null;
    for (let i = 0; i < 100; i++) {
      resp = await fetch(`${HOST}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      verifyResp = await resp.json();
      if (verifyResp.approved == "Pending") {
        await timer(3000);
      } else {
        return verifyResp;
      }
    }
    return verifyResp;
  }

  async initiateAuth(email, profile, hash) {
    let publicKey, privateKey;

    let keys = await generateKeys();
    console.log("keys", keys);
    publicKey = keys.publicKey;
    privateKey = keys.privateKey;

    const { profileId, signInMode, idType } = profile;
    const reqBody = {
      profileId: profileId,
      userPublicId: email,
      keyId: this.keyId,
      publicKey: publicKey,
      deviceType: navigator.platform,
      deviceName: navigator.userAgent,
      codeChallenge: hash,
      state: "",
      signInMode: signInMode || 0,
      idType: idType || 0,
    };

    try {
      const response = await fetch(`${HOST}/auth/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(reqBody),
      });
      return await response.json();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
