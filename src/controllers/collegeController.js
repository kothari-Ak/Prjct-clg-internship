const mongoose = require("mongoose")
const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")

//----------------------------------------------------------//
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

//------------------------regex---------------------------//

let nameRegex = /^[.a-zA-Z\s,-]+$/

//---------------------------------------------------------------//



module.exports.createCollege = async function (req, res) {
    try {
        let data = req.body
        let { name, fullName, logoLink, isDeleted } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ Status: false, message: "Please provide all the details ⚠️⚠️" })
        }

        if (!name || name == "") {
            return res.status(400).send({ Status: false, message: "Please provide name ⚠️⚠️" })
        }
        name = data.name = name.trim()
        if (!nameRegex.test(name)) {
            return res.status(400).send({ Status: false, message: "Please enter valid name ⚠️⚠️" })
        }

        if (name) {
            let checkname = await collegeModel.findOne({ name: name })
            if (checkname) {
                return res.status(400).send({ Status: false, message: "Please provide another college name, this college name has been already used ⚠️⚠️" })
            }
        }

        if (!fullName || fullName == "") {
            return res.status(400).send({ Status: false, message: "Please provide fullName ⚠️⚠️" })
        }

        fullName = data.fullName = fullName.trim()
        if (!nameRegex.test(fullName)) {
            return res.status(400).send({ Status: false, message: "Please enter valid fullName ⚠️⚠️" })
        }

        if (!logoLink || logoLink == "") {
            return res.status(400).send({ Status: false, message: "Please provide valid logoLink ⚠️⚠️" })
        }

        if (isDeleted == true) {
            res.status(400).send({ status: false, msg: "Cannot input isDeleted as true while registering ⚠️⚠️" });
            return;
        }
        let savedData = await collegeModel.create(data)
        return res.status(201).send({ status: true, msg: "College Successfully Registered ✅✅", data: savedData })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


//-----------------------------------------------------------------//


module.exports.getCollegeDetails = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false }
        let data = req.query
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, msg: "No Data Received ⚠️⚠️" });
        }

        if (Object.keys(data).length > 1) {
            return res.status(400).send({ status: false, msg: "You are allowed to give only one QueryParam ⚠️⚠️" });
        }

        const obj = Object.keys(data)
        if(!obj.includes("collegeName")){
            return res.status(400).send({status: false, msg: "QueryParam must contain collegeName as a key ⚠️⚠️"})
        }
        const obj1 = Object.values(data) 
        console.log(obj1)
        filterQuery.name = obj1

        const college = await collegeModel.findOne(filterQuery)
    
        if (!college) {
            res.status(404).send({ status: false, msg: "College details doesn't exist ⚠️⚠️" });
            return;
        }

        const interns = await internModel.find({ collegeId: college._id, isDeleted: false }, { name: 1, email: 1, mobile: 1 })

        if (interns.length === 0) {
            res.status(404).send({ status: false, msg: "Interns details doesn't exist ⚠️⚠️" });
            return;
        }

        const { name, fullName, logoLink } = college

        const response = { name: name, fullName: fullName, logoLink: logoLink }

        if (isValid(interns)) { response.interns = interns }

        return res.status(200).send({ status: true, msg : "Interns Details ✅✅", data: response });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//--------------------------------------------------------------------------------------------------------------------------------//