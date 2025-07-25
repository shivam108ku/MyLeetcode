const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/problemUtility");

const Problem = require("../models/problem");
const User = require("../models/user.model");
const Submission = require("../models/submmision.model");
const SolutionVideo = require("../models/solutionVideo");

 const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution
  } = req.body;

  try {
    // ✅ Input Validation
    if (!title || !description || !difficulty || !tags) {
      return res.status(400).send("Missing required fields: title, description, difficulty, or tags.");
    }

    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).send("visibleTestCases must be a non-empty array");
    }

    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      return res.status(400).send("referenceSolution must be a non-empty array");
    }

    // ✅ Loop through each reference solution (JavaScript, C++, etc.)
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);
      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      console.log(`Creating submissions for language: ${language}`);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);
      console.log("SUBMIT RESULT --->", submitResult);

      // ✅ Guard against undefined/null/invalid response
      if (!submitResult || !Array.isArray(submitResult)) {
        return res.status(500).send("submitBatch did not return a valid array.");
      }

      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);

      console.log("Submission Test Results: ", JSON.stringify(testResult, null, 2));

      for (const test of testResult) {
        if (test.status_id !== 3) {
          return res.status(400).send(`Test case failed for language: ${language}`);
        }
      }
    }

    // ✅ Save to MongoDB
    const userProblem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.result._id, // From user middleware
    });

    res.status(201).send("Problem Saved Successfully");
  } catch (err) {
    console.error("Error in createProblem:", err);
    res.status(500).send("Error: " + (err.message || err));
  }
};



const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).send("Id is missing");
    }

    const DsaProblem = await Problem.findById(id);

    if (!DsaProblem) {
      return res.status(404).send("Id is not present in the server ");
    }

    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output,
      }));

      const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);

      //  console.log(testResult);

      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send(`Error Occured ${language}`);
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );
    res.status(200).send(newProblem);
  } catch (error) {
    res.status(404).send("Error : " + error);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send("Id is Missing");
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return res.status(404).send("Problemn is missing");
    }

    res.status(200).send("Successfully deleetd");
  } catch (error) {
    res.status(500).send("Error" + error);
  }
};

const fetchProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send("Id is Missing");
    }

    const fetchProblem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution"
    );

    if (!fetchProblem) {
      return res.status(404).send("Problemn is missing");
    }

    const videos = await SolutionVideo.findOne({ problemId: id });
    if (videos) {
      fetchProblem.secureUrl = secureUrl;
      fetchProblem.cloudinaryPublicId = cloudinaryPublicId;
      fetchProblem.thumbnailUrl = thumbnailUrl;
      fetchProblem.duration = duration;

      return res.status(200).send(fetchProblem);
    }
    res.status(200).send(fetchProblem);
  } catch (error) {
    res.status(500).send("Error" + error);
  }
};

const fetchAllProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const fetchAllProblem = await Problem.find({}).select(
      "_id title description difficulty tags"
    );

    if (fetchAllProblem.length == 0) {
      return res.status(404).send("Problemn is missing");
    }

    res.status(200).send(fetchAllProblem);
  } catch (error) {
    res.status(500).send("Error" + error);
  }
};

const solvedProblemByUser = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};


 const getUserStats = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    // TEMPORARY: Hardcoded difficulty breakdown for testing
    const totalProblems = user.problemSolved.length;
    const difficultyCount = {
      Easy: Math.ceil(totalProblems * 0.5),   // 50% easy
      Medium: Math.ceil(totalProblems * 0.3), // 30% medium
      Hard: Math.floor(totalProblems * 0.2)   // 20% hard
    };

    res.status(200).json({
      problemsSolved: totalProblems,
      problemsByDifficulty: difficultyCount, // This will create the pie chart
      lecturesCompleted: 0,
      lastUpdated: new Date().toISOString()
    });j

  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};





 const submittedProblem = async(req,res)=>{

  try{
     
    const userId = req.result._id;
    const problemId = req.params.pid;

   const ans = await Submission.find({userId,problemId});
  
  if(ans.length==0)
    res.status(200).send("No Submission is persent");

  res.status(200).send(ans);

  }
  catch(err){
     res.status(500).send("Internal Server Error");
  }
}


module.exports = {
  createProblem,
  fetchProblemById,
  deleteProblem,
  updateProblem,
  fetchAllProblem,
  solvedProblemByUser,
  submittedProblem,
  getUserStats
};
