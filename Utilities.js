const generateKeys = async () => {
  let publicKey, privateKey;

  publicKey = localStorage.getItem("publicKey");
  privateKey = localStorage.getItem("privateKey");

  if (!privateKey || !publicKey) {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    publicKey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
    privateKey = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
  }

  localStorage.setItem("publicKey", publicKey);
  localStorage.setItem("privateKey", privateKey);

  return { publicKey, privateKey };
};
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const generateCodeChallenge = async () => {
  const codeVerifier = generateUUID();
  const hash = CryptoJS.SHA256(codeVerifier).toString();
  return { codeVerifier: codeVerifier, hash: hash };
};

function generateUUID() {
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export { generateKeys, timer, generateCodeChallenge };
