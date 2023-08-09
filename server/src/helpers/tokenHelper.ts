import jwt from "jsonwebtoken";

type Payload = {
  userId: string;
  username: string;
  password: string;
};

function encodeJWT(data: Payload) {
  const token = jwt.sign(data, "key", { expiresIn: "10d" });
  return token;
}

function decodeJWT(token: string): Payload | null {
  let payload: Payload;
  try {
    payload = jwt.verify(token, "key") as Payload;
  } catch (err) {
    console.log(err);
    return null;
  }
  if (!payload) return null;
  return payload;
}

export { encodeJWT, decodeJWT };
