import { Router, Request, Response } from "express";

export default (router: Router): void => {
  router.post("/signup", (req: Request, res: Response): void => {
    res.json({ ok: "ok " });
  });
};
