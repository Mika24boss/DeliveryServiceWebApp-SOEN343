import { storage, app, database} from "../firebaseConfig";
import { NextApiRequest, NextApiResponse} from "next";

export const firestore = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({text: "Hello World!"});
}

export default firestore;