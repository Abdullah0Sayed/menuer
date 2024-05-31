class ApiFeatures {
    constructor(mongooseQuery , queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        // 2- filter -- {key: {$gte: value}}
        let filterObject = {};
        let queryStringObject = {...this.queryString};
       
        const excludeFromQuery = ['sort','limit','fields','keyword'];
        excludeFromQuery.forEach(ele=>{
            delete queryStringObject[ele]
        })
       
        queryStringObject = JSON.stringify(queryStringObject).replace(/\b(gte|gt|lte|lt)\b/g , (match)=> `$${match}`);
         filterObject = JSON.parse(queryStringObject);

         this.mongooseQuery = this.mongooseQuery.find(filterObject);

        //  return object to chain method
        return this;
    }

    sort() {
         //  3- sorting sort('price -item_name')
         if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        }else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        }
        // return object to chain method
        return this;
    }

    limitFields() {
         // 4- fields -- select('item_name')
         if(this.queryString.fields) {
            const selectBy = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(selectBy)
        }else {
            this.mongooseQuery = this.mongooseQuery.select('-__v')
        }
        return this;
    }

    search() {
        // 5- search 
        if(this.queryString.keyword) {
            filterObject = {};
            filterObject.$or = [
                {item_name: {$regex: this.queryString.keyword , $options: 'i'}},
            ]
            this.mongooseQuery = this.mongooseQuery.find(filterObject)
        }
        return this;
    }

    pagination() {
         // 1- pagination
         let page = this.queryString.page || 1;
         let limit = this.queryString.limit || 5;
         let skip = (page - 1) * limit;
        
         this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

         return this;
    }


 }

 module.exports = ApiFeatures;