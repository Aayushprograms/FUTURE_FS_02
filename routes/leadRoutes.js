const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");


// ➕ POST: Add new lead
router.post("/", async (req, res) => {
  try {
    const newLead = new Lead(req.body);
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📋 GET: Get all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔄 PUT: Update lead status
router.put("/:id", async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📝 POST: Add note to a lead
router.post("/:id/notes", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    lead.notes.push({
      text: req.body.text
    });

    const updatedLead = await lead.save();

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🗑 DELETE: Delete a lead
router.delete("/:id", async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;