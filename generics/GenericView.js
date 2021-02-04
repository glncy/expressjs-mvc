/**
 * -------------------------
 * GenericView Documentation
 * -------------------------
 * 
 * create()
 * 
 * createRedirect()
 * 
 * findAll()
 * 
 * findAllView()
 * 
 * findOne()
 * 
 * findOneView()
 * 
 * update()
 * 
 * updateRedirect()
 * 
 * delete()
 * 
 * deleteRedirect()
 * 
 * view()
 * 
 * redirect()
 * 
 * initializer()
 * 
 * -------------------------
 * NOTE: Open for Edits. Still Improving. Thanks!
 * -------------------------
 * Author: Glency A. Tirao / me@glency.tech
 * 
 */

const createError = require('http-errors');
const { getPagination, getPagingData } = require('./../functions/pagination');

class GenericView {
    template_options = {
        query_result: undefined
    }
    query = undefined;
    order = undefined;
    attributes = undefined;
    pagination = true;
    lookup_field = "id";
    object_name = "obj";
    
    async create(){
        try {
            this.#check_model();
            let result = await this.model.create(this.req.body);
            return {
                status: "success",
                type: "created",
                result: result
            }
        }
        catch (e){
            if (e.errors !== undefined){
                return this.#errorFields(e.errors);
            }
            else {
                return this.#internalServerError(e);
            }
        }
    }

    async createRedirect(){
        try {
            this.#check_model();
            let result = await this.model.create(this.req.body);
            this.req.session['query_result'] = {
                status: "success",
                type: "created",
                result: result
            }
            this.redirect();
        }
        catch (e){
            if (e.errors !== undefined){
                this.req.session['query_result'] = this.#errorFields(e.errors);
            }
            else {
                this.req.session['query_result'] = this.#internalServerError(e);
            }
            this.redirect();
        }
    }

    async findAll(){
        try {
            this.#check_model();
            if (this.pagination){
                let page = 0;
                if (this.req.query.page !== undefined){
                    if (!isNaN(this.req.query.page)){
                        if (this.req.query.page > 0){
                            page = this.req.query.page-1;
                        }
                        else {
                            page = 0;
                        }
                    }
                    else {
                        page = 0;
                    }
                }

                const { limit, offset } = getPagination(page);

                let result = await this.model.findAndCountAll({
                    attributes: this.attributes,
                    where: this.query,
                    limit,
                    offset,
                    order: this.order,
                    raw: true
                });

                return {
                    status: "success",
                    type: "find_all",
                    result: getPagingData(result, page, limit)
                }
            }
            else if (!this.pagination) {
                let result = await this.model.findAll({
                    attributes: this.attributes,
                    where: this.query,
                    order: this.order,
                    raw: true
                });

                return {
                    status: "success",
                    type: "find_all",
                    result: result
                }
            }
            else {
                throw `\"pagination\" should be in Bolean. Received ${typeof this.pagination}.`;
            }
        } catch (e) {
            return this.#internalServerError(e);
        }
    }

    async findAllView(){
        try {
            this.#check_model();
            if (this.pagination){
                let page = 0;
                if (this.req.query.page !== undefined){
                    if (!isNaN(this.req.query.page)){
                        if (this.req.query.page > 0){
                            page = this.req.query.page-1;
                        }
                        else {
                            page = 0;
                        }
                    }
                    else {
                        page = 0;
                    }
                }

                const { limit, offset } = getPagination(page);

                let result = await this.model.findAndCountAll({
                    attributes: this.attributes,
                    where: this.query,
                    limit,
                    offset,
                    order: this.order,
                    raw: true
                });

                this.template_options[this.object_name] = {
                    status: "success",
                    type: "find_all",
                    result: getPagingData(result, page, limit)
                }
                this.view();
            }
            else if (!this.pagination) {
                let result = await this.model.findAll({
                    attributes: this.attributes,
                    where: this.query,
                    order: this.order,
                    raw: true
                });

                this.template_options[this.object_name] = {
                    status: "success",
                    type: "find_all",
                    result: result
                }
                this.view();
            }
            else {
                throw `\"pagination\" should be in Bolean. Received ${typeof this.pagination}.`;
            }
        } catch (e) {
            this.template_options[this.object_name] = this.#internalServerError(e);
            this.view();
        }
    }

    async findOne(){
        try {
            this.#check_model();
            let result = await this.model.findAll({
                where: {
                    id: this.req.params[this.lookup_field]
                },
                raw: true
            });
            if (result.length > 0){
                return {
                    status: "success",
                    type: "find_one",
                    result: result
                }
            }
            else {
                return {
                    status: "error",
                    type: "not_found"
                }
            }
        }
        catch (e){
            return this.#internalServerError(e);
        }
    }

    async findOneView(){
        try {
            this.#check_model();
            let result = await this.model.findAll({
                where: {
                    id: this.req.params[this.lookup_field]
                },
                raw: true
            });
            if (result.length > 0){
                this.template_options['query_result'] = {
                    status: "success",
                    type: "find_one",
                    result: result
                }
                this.view();
            }
            else {
                throw "not_found";
            }
        }
        catch (e){
            if (e === "not_found"){
                this.next(createError(404));
            }
            else {
                this.next(createError(500));
            }
        }
    }

    async update(){
        try {
            this.#check_model();
            let oldData = await this.model.findAll({
                where: {
                    id: this.req.params[this.lookup_field]
                },
                raw: true
            });
            let result = await this.model.update(this.req.body, {
                where: {
                    id: this.req.params[this.lookup_field]
                }
            });
            if (result[0] === 1){
                return {
                    status: "success",
                    type: "update",
                    result: this.#compare(this.req.body, oldData[0])
                }
            }
            else {
                return {
                    status: "error",
                    type: "not_found"
                }
            }
        }
        catch (e){
            if (e.errors !== undefined){
                return this.#errorFields(e.errors);
            }
            else {
                return this.#internalServerError(e);
            }
        }
    }

    async updateRedirect(){
        try {
            this.#check_model();
            let oldData = await this.model.findAll({
                where: {
                    id: this.req.params[this.lookup_field]
                },
                raw: true
            });
            let result = await this.model.update(this.req.body, {
                where: {
                    id: this.req.params[this.lookup_field]
                }
            });
            if (result[0] === 1){
                this.req.session['query_result'] = {
                    status: "success",
                    type: "update",
                    result: this.#compare(this.req.body, oldData[0])
                }
                this.redirect();
            }
            else {
                this.next(createError(404));
            }
        }
        catch (e){
            if (e.errors !== undefined){
                this.req.session['query_result'] = this.#errorFields(e.errors);
            }
            else {
                this.req.session['query_result'] = this.#internalServerError(e);
            }
            this.redirect();
        }
    }

    async delete(){
        try {
            this.#check_model();
            let data = await this.model.findAll({
                where: {
                    id: this.req.params[this.lookup_field]
                },
                raw: true
            });
            if (data.length > 0){
                let result = await this.model.destroy({
                    where: {
                        id: this.req.params[this.lookup_field]
                    }
                });
                if (result === 1){
                    return {
                        status: "success",
                        type: "delete",
                        result: data
                    }
                }
            }
            else {
                return {
                    status: "error",
                    type: "not_found"
                }
            }
        }
        catch (e){
            return this.#internalServerError(e);
        }
    }

    async deleteRedirect(){
        try {
            this.#check_model();
            let data = await this.model.findAll({
                where: {
                    id: this.req.params[this.lookup_field]
                },
                raw: true
            });
            if (data.length > 0){
                let result = await this.model.destroy({
                    where: {
                        id: this.req.params[this.lookup_field]
                    }
                });
                if (result === 1){
                    this.req.session['query_result'] = {
                        status: "success",
                        type: "delete",
                        result: data
                    }
                    this.redirect();
                }
            }
            else {
                this.next(createError(404));
            }
        }
        catch (e){
            this.req.session['query_result'] = this.#internalServerError(e);
            this.redirect();
        }
    }

    view(){
        try {
            this.res.render(this.template_view, this.template_options);
        }
        catch (e){
            e.message = "The \"template_view\" is missing. Received undefined.";
            this.next(createError(e));
        }
    }

    redirect(){
        try {
            this.res.redirect(this.redirect_url);
        }
        catch (e){
            e.message = "The \"redirect_url\" is missing. Received undefined.";
            this.next(createError(e));
        }
    }

    initializer(req, res, next){
        this.req = req;
        this.res = res;
        this.next = next;

        // CSRF
        this.template_options['_csrf'] = req.csrfToken();
        
        // Check if there's query_result in session
        if (req.session.query_result !== undefined){
            this.template_options['query_result'] = req.session.query_result;
            req.session['query_result'] = undefined;
        }
    }

    #internalServerError(e){
        console.error(e);
        return {
            status: "error",
            type: "internal_error"
        }
    }

    #errorFields(errors){
        console.log(errors);
        let result = {
            status: "error",
            type: "error_fields",
            fields: []
        }

        errors.map((data) => {
            result.fields.push({
                key: data.path,
                message: data.message
            });
        });

        return result;
    }

    #compare(new_data, old_data){
        let result = [];
        Object.entries(new_data).map((data) => {
            if (old_data[data[0]] !== undefined){
                result.push({
                    [data[0]]: {
                        new: data[1],
                        old: old_data[data[0]]
                    }
                })
            }
        });
        return result;
    }

    #check_model(){
        if (this.model === undefined){
            throw `"model" is missing. Received undefined.`
        }
    }
};
  
module.exports = GenericView;