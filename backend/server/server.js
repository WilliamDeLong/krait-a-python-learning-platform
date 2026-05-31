const express = require("express");
const app = express();
const cors = require('cors')
const dbConnection = require('./config/db.config')

// User Routes
const loginRoute = require('./routes/userRoutes/userLogin') // routes/userRoutes
const getAllUsersRoute = require('./routes/userRoutes/userGetAllUsers')
const registerRoute = require('./routes/userRoutes/userSignUp')
const getUserByIdRoute = require('./routes/userRoutes/userGetUserById')
const editUser = require('./routes/userRoutes/userEditUser')
const deleteUser = require('./routes/userRoutes/userDeleteAll')
const deleteUID = require("./routes/userRoutes/userDeleteID");

// Lesson Routes
const createLessonRoute = require('./routes/lessonRoutes/createLesson')
const deleteLessonRoute = require('./routes/lessonRoutes/deleteLessonByID')
const editLessonRoute = require('./routes/lessonRoutes/editLessonByID')
const findLessonRoute = require('./routes/lessonRoutes/findLesson')
const getLessonRoute = require('./routes/lessonRoutes/getLessonByID')

// Code Submission Routes
const createSubmissionRoute = require('./routes/submissionRoutes/codeSubmissionCreate')
const deleteSubmissionRoute = require('./routes/submissionRoutes/codeSubmissionDelete')
const updateSubmissionRoute = require('./routes/submissionRoutes/codeSubmissionUpdate')
const findSubmissionRoute = require('./routes/submissionRoutes/codeSubmissionFind')
const getAllSubmissionRoute = require('./routes/submissionRoutes/codeSubmissionGetAll')



require('dotenv').config();
const SERVER_PORT = 8081

dbConnection()
app.use(cors({origin: '*'}))
app.use(express.json())
// User Routes
app.use('/user', loginRoute);
app.use('/user', registerRoute);
app.use('/user', getAllUsersRoute);
app.use('/user', getUserByIdRoute);
app.use('/user', editUser);
app.use('/user', deleteUser);
app.use("/user", deleteUID);
// Lesson Routes
app.use('/lesson', createLessonRoute);
app.use('/lesson', deleteLessonRoute);
app.use('/lesson', editLessonRoute);
app.use('/lesson', findLessonRoute);
app.use('/lesson', getLessonRoute);
// Code Submission Routes
app.use('/submissions', createSubmissionRoute);
app.use('/submissions', deleteSubmissionRoute);
app.use('/submissions', updateSubmissionRoute);
app.use('/submissions', findSubmissionRoute);
app.use('/submissions', getAllSubmissionRoute);


app.listen(SERVER_PORT, (req, res) => {
    console.log(`The backend service is running on port ${SERVER_PORT} and waiting for requests.`);
})
