import express from "express";
import multer from "multer";
import fs from "fs";
import pkg from "pdfreader";

const { PdfReader } = pkg;

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {

    try {

      let text = "";

      new PdfReader().parseFileItems(
        req.file.path,
        (err, item) => {

          if (err) {

            console.log(err);

            return res.status(500).json({
              error: "PDF Read Error",
            });
          }

          if (!item) {

            fs.unlinkSync(req.file.path);

            return res.json({
              text,
            });
          }

          if (item.text) {
            text += item.text + " ";
          }
        }
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Resume Parsing Failed",
      });
    }
  }
);

export default router;