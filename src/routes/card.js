import express from "express";
import fetch from "node-fetch";

const app = express.Router();

app.get("/store", async (req, res) => {
  const response = await fetch(process.env.CACHE + "/store.json");
  res.status(200).json(await response.json());
});

app.get("/membership/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const response = await fetch(
      process.env.CACHE + "/paying-member.json"
    ).then((response) => response.json());
    let isMember = Boolean(false);
    for (let i = 0; i < response.length; i++) {
      if (uid == response[i].stuId) {
        isMember = Boolean(true);
        break;
      }
    }

    if (isMember == Boolean(true)) {
      res.status(200).json({ uid: uid, membership: "會費會員" });
    } else {
      res.status(200).json({ uid: uid, membership: "一般會員" });
    }
  } catch (err) {
    res.status(500).json({ status: "fetch err" });
  }
});

app.post("/membership/:uid", async (req, res) => {
  const { uid } = req.params;
  const { token } = req.headers;
  if (token != process.env.membership_afterpay_token) {
    res.status(401).json({ status: "Auth error" });
  } else {
    const response = await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSdFTO7XQghlOXWkjaP1T6hajuzpR9eBCyitUJA2ZZiofgm_Bg/formResponse",
      { method: "POST", body: new URLSearchParams({ "entry.305453546": uid }) }
    );
    if (response.status == 200) {
      res.status(200).json({ status: "success", uid: uid });
    } else {
      res
        .status(response.status)
        .json({ status: "Form response error", uid: uid });
    }
  }
});

export default app;
