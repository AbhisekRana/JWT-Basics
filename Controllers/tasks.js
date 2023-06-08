const schema = require('../models/task')

const createItems = async (req,res) => {
    try {
        const items = await schema.create(req.body)
        res.status(201).json({items})
    } catch (error) {
        res.status(500).json({msg : error})
    }
}

const deleteItems = async (req,res) => {
    try {
        const items = await schema.findOneAndDelete()
        res.status(201).json({items})
    } catch (error) {
        res.status(500).json({msg : error})
    }
}

const getAllItems = async (req,res) => {
    try {
        const {name,company,featured,sort,fields,numericFilter} = req.query

        const queryObject = {}

        if(featured){
            queryObject.featured = featured === 'true' ? true : false
        }

        if(company){
            queryObject.company = company
        }

        if(name){
            queryObject.name = { $regex : name, $options : 'i'}
        }

        if(numericFilter){
            const operatorMap = {
                '<' : '$lt',
                '<=' : '$lte',
                '=' : '$eq',
                '>=' : '$gte',
                '>' : '$gt',
            }
            const regEx = /\b(<|<=|=|>=|>)\b/g
            let filters = numericFilter.replace(regEx,(match)=>`-${operatorMap[match]}-`)
            const options = ['price','rating']
            filters = filters.split(',').forEach((item) => {
                const [field,operator,value]= item.split('-')
                if(options.includes(field)){
                    queryObject[field] = { [operator] : Number(value)} 
                }
            });
        }

        let result = schema.find(queryObject)

        if(sort){
            const sortList = sort.split(',').join(' ')
            result = result.sort(sortList)
        }
        else {
            result = result.sort('createdAt');
        }

        if(fields){
            const fieldList = fields.split(',').join(' ')
            result = result.select(fieldList)
        }
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page-1)*limit
        result = result.skip(skip).limit(limit)

        const items = await result

        res.status(201).json({items})

    } catch (error) {
        res.status(500).json({msg : error})
    }
}



module.exports = {getAllItems,createItems,deleteItems}