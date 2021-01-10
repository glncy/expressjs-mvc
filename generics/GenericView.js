/**
 * GenericView
 * 
 * Still Improving...
 */

const { getPagination, getPagingData } = require('./../functions/pagination');

class GenericView {
    async create(){
        return await this.model.create(this.req.body);
    }

    async findAll(){
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
            // where: query,
            limit,
            offset,
            // order: [
            //     ['id', order]
            // ],
            raw: true
        });

        return getPagingData(result, page, limit);
    }

    async findOne(){
        return await this.model.findAll({
            where: {
                id: this.req.params.id
            },
            raw: true
        })
    }

    async update(){
        return await this.model.update(this.req.body, {
            where: {
                id: this.req.params.id
            }
        });
    }

    async delete(){
        return await this.model.destroy({
            where: {
                id: this.req.params.id
            }
        })
    }

    view(){
        this.res.render(this.template_view, this.template_options);
    }

    redirect(){
        this.res.redirect(this.redirect_url);
    }
};
  
module.exports = GenericView;
  