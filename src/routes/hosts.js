import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
//import checkRequiredFields from "../middleware/checkRequiredFields.js";
import getHosts from "../services/hosts/getHosts.js";
import createHost from "../services/hosts/createHost.js";
import getHostById from "../services/hosts/getHostById.js";
import deleteHostById from "../services/hosts/deleteHostById.js";
import updateHostById from "../services/hosts/updateHostById.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("Fetching hosts...");
    const { name } = req.query;

    const hosts = await getHosts(name); // Ophalen van hosts, met of zonder naam

    if (!hosts || hosts.length === 0) {
      return res.status(404).json({ error: "No hosts found" });
    }

    console.log("Hosts fetched:", hosts);
    res.status(200).json(hosts);
  } catch (error) {
    console.error("Error fetching hosts:", error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await getHostById(id);

    if (!host) {
      res.status(404).json(host);
    } else {
      res.status(200).json(host);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    } = req.body;
    const newHost = await createHost(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe
    );

    if (!newHost) {
      res.status(400).json(newHost);
    } else {
      res.status(201).json(newHost);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe,
      } = req.body;
      const updatedHost = await updateHostById(id, {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe,
      });

      if (!updatedHost) {
        res.status(404).json(updatedHost);
      } else {
        res.status(200).json(updatedHost);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      await deleteHostById(id);

      res.status(200).send({
        message: `Host with id ${id} successfully deleted`,
      });
    } else {
      res.status(404).json({
        message: `Host with id ${id} not found`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
