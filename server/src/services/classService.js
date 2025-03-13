const ClassModel = require('../models/class.model')
const HTTP_STATUS = require('../constants/httpConstants')
const validator = require('validator')  
const sanitizeHtml = require('sanitize-html')  
const { validateRequiredParams } = require('../utils/paramsValidator')
const { appAssert } = require('../utils/appAssert')
const { generateUniqueClassCode } = require('../utils/classUtils')
const TeacherModel = require('../models/teacher.model')
const UserModel = require("../models/user.model")

const createClassService = async (userRole, teacherId, className) => {
  try {
    // Check if all required params are present
    validateRequiredParams(userRole, teacherId, className)

    // Check if user role is teacher to give permission
    appAssert(userRole === 'teacher', 'You dont have a permission to perform this action', HTTP_STATUS.FORBIDDEN)

    // Check if the provided teacherId is a valid MongoDB ObjectId
    appAssert(validator.isMongoId(teacherId), 'Invalid teacher ID format', HTTP_STATUS.BAD_REQUEST)

    // Find teacher accound by its id
    const teacher = await TeacherModel.findById(teacherId)


    // Check if teacher account exists
    appAssert(teacher, 'Teacher account not found', HTTP_STATUS.BAD_REQUEST)

    // Validate and sanitize name
    appAssert(className.length >= 6 && className.length <= 14, 'Name must be longer than 6 characters and shorter than 14', HTTP_STATUS.BAD_REQUEST)
    const sanitizedClassName = sanitizeHtml(className.trim())

    // Used a utility function to generate class code
    const classCode = await generateUniqueClassCode()

    const newClass = new ClassModel({
      name: sanitizedClassName,
      code: classCode,
      teacher: teacherId,
      students: [],
      grades: [],
    })

    await newClass.save()

    teacher.classes.push(newClass._id)

    await teacher.save()

    return classCode
  } catch (error) {
    throw(error)
  }
}

const inviteStudentService = async (userRole, teacherId, studentId, classId) => {
  try {
    validateRequiredParams(userRole, teacherId, studentId, classId)
    appAssert(userRole === "teacher", "Permission denied", HTTP_STATUS.FORBIDDEN)
    appAssert(validator.isMongoId(teacherId) && validator.isMongoId(studentId) && validator.isMongoId(classId),
              "Invalid IDs", HTTP_STATUS.BAD_REQUEST)

    const classData = await ClassModel.findById(classId)
    appAssert(classData, "Class not found", HTTP_STATUS.NOT_FOUND)
    appAssert(classData.teacher.toString() === teacherId, "Not your class", HTTP_STATUS.FORBIDDEN)

    const student = await UserModel.findById(studentId)
    appAssert(student, "Student not found", HTTP_STATUS.NOT_FOUND)

    // Check if student is already in the class
    const existingStudent = classData.students.find(s => s.student.toString() === studentId && s.status === "joined")
    appAssert(!existingStudent, "Student is already in the class", HTTP_STATUS.BAD_REQUEST)

    // Check if student already has an invite
    const existingInvite = student.invitations.find((invite) => invite.classId.toString() === classId)
    appAssert(!existingInvite, "Student already invited", HTTP_STATUS.BAD_REQUEST)

    // Add invitation to both class and student
    const studentIndex = classData.students.findIndex(s => s.student.toString() === studentId)

    if (studentIndex !== -1) {
        // Student exists, update their status
        classData.students[studentIndex].status = "invited"
    } else {
        // Student does not exist, add them
        classData.students.push({ student: studentId, status: "invited" })
    }

    student.invitations.push({ classId, classCode: classData.code, status: "invited" })

    await classData.save()
    await student.save()

  } catch (error) {
    throw(error)
  }
}

const acceptInvitationService = async (userRole, studentId, classId) => {
  try {
    validateRequiredParams(userRole, studentId, classId)
    appAssert(userRole === "student", "Permission denied", HTTP_STATUS.FORBIDDEN)
    appAssert(validator.isMongoId(studentId) && validator.isMongoId(classId), "Invalid IDs", HTTP_STATUS.BAD_REQUEST)

    const classData = await ClassModel.findById(classId)
    appAssert(classData, "Class not found", HTTP_STATUS.NOT_FOUND)

    const student = await UserModel.findById(studentId)
    appAssert(student, "Student not found", HTTP_STATUS.NOT_FOUND)

    // Find the student's invitation
    const inviteIndex = student.invitations.findIndex((invite) => invite.classId.toString() === classId)
    appAssert(inviteIndex !== -1, "No invitation found", HTTP_STATUS.BAD_REQUEST)

    // Move student to "joinedClasses" and remove from invitations
    student.joinedClasses.push(classId)
    student.invitations.splice(inviteIndex, 1) // Remove invitation

    // Update the class list
    const studentEntry = classData.students.find((s) => s.student.toString() === studentId)
    if (studentEntry) {
      studentEntry.status = "joined" // Update class status
    }

    await classData.save()
    await student.save()
  } catch (error) {
    throw(error)
  }
}

const rejectInvitationService = async (userRole, studentId, classId) => {
  try {
    validateRequiredParams(userRole, studentId, classId)
    appAssert(userRole === "student", "Permission denied", HTTP_STATUS.FORBIDDEN)
    appAssert(validator.isMongoId(studentId) && validator.isMongoId(classId), "Invalid IDs", HTTP_STATUS.BAD_REQUEST)

    const student = await UserModel.findById(studentId)
    appAssert(student, "Student not found", HTTP_STATUS.NOT_FOUND)

    const classData = await ClassModel.findById(classId)
    appAssert(classData, "Class not found", HTTP_STATUS.NOT_FOUND)

    // Find the invitation in student model
    const inviteIndex = student.invitations.findIndex((invite) => invite.classId.toString() === classId)
    appAssert(inviteIndex !== -1, "No invitation found", HTTP_STATUS.BAD_REQUEST)

    // Remove the invitation from student
    student.invitations.splice(inviteIndex, 1)

    // Find the student in class and update status to "rejected"
    const studentEntry = classData.students.find((s) => s.student.toString() === studentId)
    if (studentEntry) {
      studentEntry.status = "rejected"
    }

    // Save the updated records
    await student.save()
    await classData.save()

  } catch (error) {
    throw error
  }
}

const fetchTeacherClassService = async (teacherId) => {
  try {
    validateRequiredParams(teacherId)

    appAssert(validator.isMongoId(teacherId), 'Invalid user id', HTTP_STATUS.BAD_REQUEST)

    const teacher = await TeacherModel.findById(teacherId).populate({
      path: "classes",
      populate: {
        path: "students.student",
        select: "name email", 
      },
    })

    appAssert(teacher, 'User id is not found', HTTP_STATUS.NOT_FOUND)

    const classesDetails = teacher.classes.map((classItem) => ({
      _id: classItem._id,
      name: classItem.name,
      code: classItem.code,
      students: classItem.students.map((s) => ({
        _id: s.student._id,
        name: s.student.name,
        email: s.student.email,
        status: s.status, 
      })),
    }))

    return classesDetails
  } catch (error) {
    throw error
  }
}

const joinClassService = async (classCode, studentId) => {
  try {
    validateRequiredParams(classCode, studentId)

    const classData = await ClassModel.findOne({ code: classCode })
    appAssert(classData, 'Class is not found', HTTP_STATUS.NOT_FOUND)

    const existingStudent = classData.students.find(s => s.student.equals(studentId))
    appAssert(!existingStudent, 'Already invited, pending, or joined', HTTP_STATUS.BAD_REQUEST)

    const student = await UserModel.findById(studentId)
    appAssert(student, 'Student is not found', HTTP_STATUS.NOT_FOUND)

    classData.students.push({ student: studentId, status: "pending" })
    await classData.save()
    
    student.pendingApproval.push({ classId: classData._id, classCode: classData.code })
    await student.save()
  } catch (error) {
    throw error
  }
}

module.exports = {
  createClassService,
  acceptInvitationService,
  rejectInvitationService,
  inviteStudentService,
  fetchTeacherClassService,
  joinClassService,
}