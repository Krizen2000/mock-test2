import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import ClientSchema from "@models/Client";
import { encodeJWT } from "@helpers/tokenHelper";

type Client = {
  _id: string;
  username: string;
  email: string;
  password: string;
};

const salt = bcrypt.genSaltSync(10);

async function signupController(req: Request, res: Response) {
  const ClientModel = new ClientSchema();
  const { username, email, password } = req.body as Client;
  const passwordHash = bcrypt.hashSync(password, salt);
  console.log("register:", req.body);

  const exist = await ClientModel.exists({ email });
  if (exist) {
    res.status(409).json({ message: "Client already exists" });
    return;
  }

  let clientObject: Client | null;
  try {
    clientObject = await ClientModel.createOne({
      username,
      email,
      password: passwordHash,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  if (!clientObject) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  const token = encodeJWT({
    userId: clientObject._id.toString(),
    username,
    password: passwordHash,
  });
  res.status(201).json({ token, username });
}

async function loginController(req: Request, res: Response) {
  console.log("login with", req.body);
  const ClientModel = new ClientSchema();
  const { email, password } = req.body as Client;

  let clientObject: Client | null;
  try {
    clientObject = await ClientModel.findOne({ email });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Somthing went wrong" });
    return;
  }
  if (!clientObject) {
    res.status(500).json({ message: "Client not found" });
    return;
  }
  if (!bcrypt.compareSync(password, clientObject.password)) {
    res.status(401).json({ message: "Wrong credentials" });
    return;
  }
  const token = encodeJWT({
    userId: clientObject._id.toString(),
    username: clientObject.username,
    password: clientObject.password,
  });
  console.log({ token });
  res.status(200).json({
    token,
    username: clientObject.username,
  });
}

export { signupController, loginController };
