import { parseAuthPayload } from "@auth/auth";
import { toErrorResponse } from "@common/mappers";
import { db } from "@db/client";
import { Router, RequestHandler, Request } from "express";
import { User } from "@common/models";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuid } from "uuid";
import { s3 } from "@db/bucket";
import { config } from "@config/config";

interface UploadRequest extends Request {
  filename: string;
}

const upload = multer({
  storage: multerS3({
    s3,
    bucket: config.aws.bucketName,
    key: (req, file, cb) => {
      const filename = `${file?.originalname}-${uuid()}`;
      (req as UploadRequest).filename = filename;
      cb(null, filename);
    },
  }),
});

const getUser: RequestHandler = async (req, res) => {
  const { id } = parseAuthPayload(req);

  try {
    const user = await db.querySingle<User>(
      `SELECT id, email, fullname, avatar FROM users WHERE id = $1`,
      [id]
    );

    res.json(user);
  } catch (e) {
    res.status(400).json(toErrorResponse(e));
  }
};

const uploadAvatar: RequestHandler = async (req, res) => {
  const { id } = parseAuthPayload(req);
  const filename = (req as UploadRequest).filename;
  const uri = `${config.aws.bucketUrl}${filename}`;

  try {
    await db.mutate(`UPDATE users  SET avatar = $1 WHERE id = $2;`, [uri, id]);
    res.json({ avatar: uri });
  } catch (e) {
    res.status(500).json(toErrorResponse(e));
  }
};

const removeAvatar: RequestHandler = async (req, res) => {
  const { id } = parseAuthPayload(req);

  try {
    const { avatar } = await db.querySingle(
      `SELECT avatar FROM users WHERE id = $1`,
      [id]
    );

    const filename = avatar?.split(config.aws.bucketUrl)[1];

    s3.deleteObject({ Bucket: "blog-avatars", Key: filename }, async (err) => {
      if (err) throw err;
      await db.mutate(`UPDATE users SET avatar = NULL WHERE id = $1;`, [id]);
      res.sendStatus(204);
    });
  } catch (e) {
    res.status(500).json(toErrorResponse(e));
  }
};

const usersApi = Router()
  .get("/", getUser)
  .post("/avatar-upload", upload.single("file"), uploadAvatar)
  .delete("/avatar-remove", removeAvatar);

export { usersApi };
