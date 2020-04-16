var connection = require("./connect");

/**
 * 初始化方法
 * @param {Object} model 表结构
 */
let init = function(model){
    var dbutil = {};

	dbutil.create = (info) => {
		return create(model,info);
	};
	// dbutil.findById = (id,clusion,opt) => {
	// 	return findById(model,id,clusion,opt);
	// };
	// dbutil.findOne = (condition,clusion,opt) => {
	// 	return findOne(model,condition,clusion,opt);
	// };
	// dbutil.find = (condition,clusion,opt) => {
	// 	return find(model,condition,clusion,opt);
	// };
	// dbutil.findAndCount = (condition) => {
	// 	return findAndCount(model,condition);
	// };
	// dbutil.findByIdAndUpdate = (id,updateOpt) => {
	// 	return findByIdAndUpdate(model,id,updateOpt);
	// };
	// dbutil.findOneAndUpdate = (condition,updateOpt) => {
	// 	return findOneAndUpdate(model,condition,updateOpt);
	// };
	// dbutil.findAndRemove = (condition) => {
	// 	return findAndRemove(model,condition);
	// };
	// dbutil.findByIdAndRemove = (id) => {
	// 	return findByIdAndRemove(model,id);
	// };
	// dbutil.findOneAndRemove = (condition) => {
	// 	return findOneAndRemove(model,condition);
	// };
	return dbutil;
}

/**
 * 创建
 * @param {Object} model [表结构] 
 * @param  {[Object]} info  [创建的参数]
 * @return {[Promise]}   
 */
var create = (Model,info) =>{
    var now = new Date();
    return new Promise((reslove,reject) => {
        connection.query()
        Model.create(info,(err,result) => {
            var end = new Date();
            var min = end.getTime() - now.getTime();
            if(min > 500){
                console.log("创建create耗时:"+min);
            }
            if(err){
                reject(err);
            }else{
                reslove(result);
            }
        });
    });
};

// 删
// 改
// 查











//返回一个初始化方法
module.exports = init;