let opt = {
    getCreateQuery:getCreateQuery,
    getSelectQuery:getSelectQuery,
    getUpdateQuery:getUpdateQuery,
    getDeleteQuery:getDeleteQuery
}


let getCreateQuery = function(model,info){
    let obj = {
        sql:"",
        params:[]
    };
}

module.exports = opt;