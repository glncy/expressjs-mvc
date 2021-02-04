/**
 * Class Exporter
 * 
 * Improving this class exporter
 */

let notExistError = "Method not exisiting.";

const exporter = (LoadedClass) => {
    var class_methods = {}
    Object.getOwnPropertyNames(LoadedClass.prototype).map((method) => {
        class_methods[method] = async (req, res, next) => {
            const importedClass = new LoadedClass(req, res, next);
            if (typeof importedClass[method] === "function") { 
                importedClass[method]()
            }
            else {
                throw notExistError;
            }
        }
    });
    return class_methods;
}

module.exports = exporter;