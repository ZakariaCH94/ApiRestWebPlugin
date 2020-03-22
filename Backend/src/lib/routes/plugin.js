const express = require('express');
const router = express.Router();


const mesServices = require('../services/mesServices');
const pluginController = require('../controllers/plugin');



router.post("/creerPlugin",mesServices.verifieToken,mesServices.upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pluginZip', maxCount: 1 }]),pluginController.createPlugin);
router.get("/listPlugins", mesServices.verifieToken,pluginController.getAllPluginsPagination);
router.get("/PluginsById/:id",mesServices.verifieToken, pluginController.getPluginsById);
router.get("/PluginsByUser/:username",mesServices.verifieToken, pluginController.getPluginsByUserPagination);
router.put("/PluginsUpdate/:id",mesServices.verifieToken, pluginController.updatePlugin);
router.get("/PluginsByCat",mesServices.verifieToken, pluginController.getPluginsByCategoryPagination);

module.exports = router;

