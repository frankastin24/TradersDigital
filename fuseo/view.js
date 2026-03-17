let {renderAsync} = require('./ejsCompiler');

const fs = require('fs');

const __ = require('../includes/__');
const { get } = require('./routing');

const getTemplatePart = async (path,viewContext) => {
    const ejxstring = fs.readFileSync(global.__app_path +'/views/' + path + '.ejs', 'utf8');
    return await renderAsync(ejxstring,viewContext);;
}

const getHeader = async (viewContext) => {      
   

    return getTemplatePart('header',viewContext);

}

const getFooter = async (viewContext) => {      
   

    return getTemplatePart('footer',viewContext);

}

const view = async (path,data,context) => {

    const ejxstring = fs.readFileSync(global.__app_path +'/views/' + path + '.ejs', 'utf8');
    
    const viewContext = {
    "__":__,
    getTemplatePart,
    getHeader,
    getFooter,
    context,
    data
   
    }
    viewContext.viewContext = viewContext;

    const renderTemplate = await renderAsync(ejxstring,viewContext);
   
    context.res.send(renderTemplate);
    
}

module.exports = {view, getTemplatePart};