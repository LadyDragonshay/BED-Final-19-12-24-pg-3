import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
//import checkRequiredFields from "../middleware/checkRequiredFields.js";
import getUsers from "../services/users/getUsers.js";
import createUser from "../services/users/createUser.js";
import getUserById from "../services/users/getUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";
import updateUserById from "../services/users/updateUserById.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    console.log("Fetching users...");
    const { username, email } = req.query;
    const users = await getUsers(username, email);
    console.log("Users fetched", users);

    const usersWithoutPassword = users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword
    );
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      res.status(404).json({ message: `User with id ${id} was not found` });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture } =
      req.body;
    const newUser = await createUser(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture
    );

    if (!newUser) {
      res.status(400).json(newUser);
    } else {
      res.status(201).json(newUser);
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      const { username, password, name, email, phoneNumber, profilePicture } =
        req.body;

      const updatedUser = await updateUserById(id, {
        username,
        password,
        name,
        email,
        phoneNumber,
        profilePicture,
      });

      if (!updatedUser) {
        // Return a 404 response if the user was not found
        return res.status(404).json({ message: "User not found." });
      } else {
        // Return the updated user if successful
        return res.status(200).json(updatedUser);
      }
    } else {
      // Return an error if no ID was provided
      return res.status(400).json({ message: "User ID is required." });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:id?", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Received request to delete user with ID:", id);

    if (id) {
      await deleteUserById(id);

      res.status(200).json({
        message: `User with id ${id} was successfully deleted!`,
      });
    } else {
      res.status(404).json({
        message: "User with id ${id} not found!",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
