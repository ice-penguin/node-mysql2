var mysql = require('mysql');


/**
 * 初始化数据库连接
 * @param {*} table 
 */
const createClient = function(opt){
	let connection = mysql.createConnection(opt);
	   
	connection.connect((err, result) => {
		if (err) {
			console.log(err);
			console.log("连接失败");
			return;
		}
		console.log(result);
		console.log("连接成功");
	});

	/**
	 * 初始化方法
	 * @param {Object} table 表结构
	 * @param {Object} tableName 表名
	 * 支持type数据类型,default默认值,ref连表，其中type为必填，require是否为必填项
	 * {
	 * 	type:Number,
	 * 	default:Number,
	 * 	ref:"gift",
	 * 	require:true
	 * }
	 */
	const Table = function(table,tableName){
		const schema = {};
		//检查table是否符合格式
		if(typeof(table) != "object"){
			console.log("table_schema not a object");
			return;
		}
		if(!tableName){
			console.log("tableName not exists");
			return;
		}
		tableName = tableName.toLowerCase();
		let msg;
		for(let key in table){
			schema[key] = {};
			let type = typeof(table[key]);
			// console.log(type);
			//如果传入的类型不为构造函数,且不是对象则报错，停止初始化
			if(type == "object"){
				//检查type,default,ref
				//type为构造函数
				//default使用构造函数初始化
				//ref为字符串，进行小写转化
				if(typeof(table[key]["type"]) != "function"){
					msg = key+"数据类类型错误";
					break;
				}
				schema[key]["type"] = table[key]["type"];
				if(typeof(table[key]["default"]) != "undefined"){
					schema[key]["default"] = schema[key]["type"](table[key]["default"])
				}
				//如果存在连表参数，则判断是否为string
				if(schema[key]["ref"]){
					if(typeof(schema[key]["ref"]) != "string"){
						msg = key+"ref错误";
						break;
					}
					schema[key]["ref"] = table[key]["ref"].toLowerCase();
				}
				//是否为必填项
				schema[key]["require"] = table[key]["require"] == true ? true:false;
				
			}else if(type == "function"){
				schema[key].type = table[key];
			}else{
				msg = key+"数据类类型错误";
				break;
			}
		}
		if(msg){
			console.log(msg);
			return;
		}
		// console.log(schema,schema.isMatch.default)

		this.create = (connection,opt) => {
			return doShell(connection,getSql(connection,tableName,opt,"","","create"));
		};
		this.findById = (id,clusion,opt) => {
			
			return doShell(connection,sql);
		};
		this.findOne = (condition,clusion,opt) => {
			
			return doShell(connection,sql);
		};
		this.find = (condition,clusion,opt) => {
			
			return doShell(connection,sql);
		};
		this.findAndCount = (condition) => {
			
			return doShell(connection,sql);
		};
		this.findByIdAndUpdate = (id,updateOpt) => {
			
			return doShell(connection,sql);
		};
		this.findOneAndUpdate = (condition,updateOpt) => {
			
			return doShell(connection,sql);
		};
		this.findAndRemove = (condition) => {
			
			return doShell(connection,sql);
		};
		this.findByIdAndRemove = (id) => {
			
			return doShell(connection,sql);
		};
		this.findOneAndRemove = (condition) => {
			
			return doShell(connection,sql);
		};
	}

	return {
		Table:Table
	};
}

// 获取查询条件
const getQueryStr = function(connection,opt){
	var str = "";
	for(var key in opt){
		if(str != ""){
			str += "&&"
		}
		str += (key + "=" + connection.escape(opt[key]));
	}
	return str;
}

/**
 * 
 * @param {String} tableName 表名
 * @param {Object} opt 查询参数
 * @param {Object} opt2 当status为updte时，为更新参数，为select时为需查询的参数，支持字符串
 * 						name key value 代表只获取name,key,value中间使用空格间隔
 * @param {Object} opt3 当status为select时有效
						{
							skip:1,//起始条数
							limit:2,//限制条数
							sort:{createDate:-1},//排序顺序，-1为降序，1为升序
							populate:"gift"//联表字段，仅当model有ref时支持
						}
 * @param {String} status sql状态，增删改查，create、update、delete、select
 */
const getSql = function(connection,tableName,opt,opt2,opt3,status){
	//防注入 connection.escape(userId)
	let sql = "";
	let queryStr = "";
	console.log(tableName,opt,status);
	switch(status){
		case "create":
			// INSERT INTO `api_type`(`typeName`,`typeDes`) VALUES ("实名验证","手机、姓名、身份证3要素核验"),("短信服务","短信服务"); 
			sql += "INSERT INTO "+tableName;
			let keyStr = "";
			let valueStr = "";
			for(var key in opt){
				//如果keyStr为空，则初始化字符串
				if(keyStr == ""){
					keyStr = "(";
					valueStr = "(";
				}else{
					keyStr += ",";
					valueStr += ",";
				}
				keyStr += key;
				valueStr += connection.escape(opt[key]);
			}
			keyStr += ")";
			valueStr += ")";
			sql += (keyStr + " VALUES " + valueStr);
			break;
		case "update":
			// update api_his set _org=1,params=2 WHERE _org = "租户1" && params = "sss1";
			sql += "UPDATE "+tableName+" SET ";
			queryStr = getQueryStr(connection,opt);
			let updateStr = "";
			for(var key in opt2){
				//如果keyStr为空，则初始化字符串
				if(updateStr != ""){
					updateStr += ",";
				}
				updateStr += (key + "=" + connection.escape(opt[key]));
			}
			sql += updateStr;
			sql = queryStr == ""?sql:(sql+ " WHERE " + queryStr);
			break;
		case "select":
			// select * from api_his where name = 1;
			let model = "*";
			//判断opt是否为字符串，并获取查询数据
			if(typeof(opt2) == "string"){
				let arr = opt2.split(/\s{1,}/);
				model = arr.length>0?arr.join(","):model;
			}
			queryStr = getQueryStr(connection,opt);
			sql = "SELECT "+model+" FROM "+tableName;
			sql = queryStr == ""?sql:(sql+ " WHERE " + queryStr);
			//增加opt3的属性
			break;
		case "delete":
			//DELETE FROM table_name WHERE name=1
			queryStr = getQueryStr(connection,opt);
			sql = "DELETE FROM "+tableName;
			sql = queryStr == ""?sql:(sql+ " WHERE " + queryStr);
			break;
					
	}

	console.log("sql",sql);
	return sql;
}


/**
 * 执行shell
 * @param {Object} connection [数据库连接] 
 * @param {Object} sql [sql语句] 
 * @return {[Promise]}   
 */
const doShell = (connection,sql) =>{
    let now = new Date();
    return new Promise((reslove,reject) => {
		connection.query(sql, (err, result) => {
			let end = new Date();
            let min = end.getTime() - now.getTime();
            if(min > 500){
                console.log("创建create耗时:"+min);
            }
			if(err){
				console.log('操作失败:', err.message);
				reject('操作失败:', err.message);
				return;
			}else{
				console.log('--------------SELECT------------');
				console.log('执行成功:',result);
				console.log('--------------------------\n\n');
                reslove(result);
            }
		});
    });
};

// 删
// 改
// 查











//返回一个初始化方法
module.exports = createClient;//创建连接客户端