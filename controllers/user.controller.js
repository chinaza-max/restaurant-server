import ViewStat from "../models/ViewStat.js";


export const incrementView = async (req, res) => {
  try {


    //console.log(req.)
    const adminId = req.params.adminId;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const stat = await ViewStat.findOneAndUpdate(
      { adminId, month, year },
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "View counted", stat });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to record view" });
  }
};
