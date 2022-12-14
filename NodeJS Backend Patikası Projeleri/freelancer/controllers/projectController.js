const Project = require("../models/Project");
const fs = require("fs");

exports.createProject = async (req, res) => {
  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + "/../public/uploads/" + uploadeImage.name;

  uploadeImage.mv(uploadPath, async () => {
    await Project.create({
      ...req.body,
      image: "/uploads/" + uploadeImage.name,
    });
    res.redirect("/");
  });
};

exports.getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render('index', {
    project,
  });
};

exports.getAllProjects = async (req, res) => {

  const projects = await Project.find({})
  //.sort('-dateCreated')
  res.render('index', {
    projects: projects
  });
};


exports.updateProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id });
  project.title = req.body.title;
  project.desc = req.body.desc;
  // project.image = req.body.image;
  project.save();

  res.redirect('/')
};

exports.deleteProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + project.image;
  fs.unlinkSync(deletedImage);
  await Project.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
