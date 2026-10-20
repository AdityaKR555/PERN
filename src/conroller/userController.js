const { user } = require("../model/user");

const createdUser = async (req, res) => {
    const { userName, email, phoneNumber, message } = req.body;

    try {
        const newUser = await user.create({
            userName,
            email,
            phoneNumber,
            message
        });

        if (!newUser) {
            return res.status(400).json({ error: "Failed to create user" });
        }

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  


const viewUser = async (req, res) => {
    try {
        const users = await user.findAll();
        res.status(200).json({
            message: "Users retrieved successfully",
            users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await user.destroy({
            where: { id }
        });
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { userName, email, phoneNumber, message } = req.body;

    const updateObject = { userName, email, phoneNumber, message };

    try {
        const updatedRows = await user.update(updateObject, {
            where: { id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createdUser, viewUser, deleteUser, updateUser };